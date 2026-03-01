import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import * as XLSX from 'xlsx'

interface ProductRow {
    // Support both simplified and technical column names
    'ID'?: string | number
    'id'?: string | number
    'Product Name'?: string
    'name'?: string
    'Description'?: string
    'description'?: string
    'Details'?: string
    'product_details'?: string
    'Care Instructions'?: string
    'care_instructions'?: string
    'Price'?: string | number
    'price'?: string | number
    'Categories'?: string
    'categories'?: string
    'Type'?: string
    'product_type'?: string
    'Variation Names'?: string
    'Variation Prices'?: string
    'Image URLs'?: string
    'images'?: string
}

interface ImportError {
    row: number
    error: string
}

interface ImportSummary {
    total: number
    created: number
    updated: number
    failed: number
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Validate file type
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ]
        if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
            return NextResponse.json(
                { error: 'Invalid file type. Please upload an Excel file (.xlsx, .xls) or CSV' },
                { status: 400 }
            )
        }

        // Read file buffer
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })

        // Get first sheet
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]

        // Convert to JSON
        const rows: ProductRow[] = XLSX.utils.sheet_to_json(sheet)

        if (rows.length === 0) {
            return NextResponse.json(
                { error: 'No data found in the file' },
                { status: 400 }
            )
        }

        const supabase = createServiceRoleClient()
        const errors: ImportError[] = []
        const summary: ImportSummary = {
            total: rows.length,
            created: 0,
            updated: 0,
            failed: 0
        }

        // Helper to get value from row (supports both column name formats)
        const getValue = (row: ProductRow, keys: string[]): string => {
            for (const key of keys) {
                const val = row[key as keyof ProductRow]
                if (val !== undefined && val !== null && String(val).trim() !== '') {
                    return String(val).trim()
                }
            }
            return ''
        }

        // Process each row (one product per row)
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i]
            const rowNumber = i + 2

            try {
                // Get values supporting both column name formats
                const rowIdStr = getValue(row, ['ID', 'id'])
                const rowId = rowIdStr ? parseInt(rowIdStr) : null
                const name = getValue(row, ['Product Name', 'name'])
                const description = getValue(row, ['Description', 'description'])
                const details = getValue(row, ['Details', 'product_details'])
                const careInstructions = getValue(row, ['Care Instructions', 'care_instructions'])
                const priceStr = getValue(row, ['Price', 'price'])
                const categories = getValue(row, ['Categories', 'categories'])
                const productTypeStr = getValue(row, ['Type', 'product_type'])
                const variationNames = getValue(row, ['Variation Names'])
                const variationPrices = getValue(row, ['Variation Prices'])
                const images = getValue(row, ['Image URLs', 'images'])

                // Validate required fields
                if (!name) {
                    errors.push({ row: rowNumber, error: 'Product Name is required' })
                    summary.failed++
                    continue
                }

                if (!description) {
                    errors.push({ row: rowNumber, error: 'Description is required' })
                    summary.failed++
                    continue
                }

                const productType = productTypeStr.toLowerCase() === 'variable' ? 'variable' : 'simple'

                // Validate price for simple products
                if (productType === 'simple') {
                    const price = parseFloat(priceStr)
                    if (isNaN(price) || price <= 0) {
                        errors.push({ row: rowNumber, error: 'Price is required for simple products' })
                        summary.failed++
                        continue
                    }
                }

                // Parse variations for variable products
                let variations = null
                if (productType === 'variable') {
                    const names = variationNames.split(',').map(n => n.trim()).filter(n => n)
                    const prices = variationPrices.split(',').map(p => p.trim()).filter(p => p)

                    if (names.length === 0 || prices.length === 0) {
                        errors.push({ row: rowNumber, error: 'Variable products need Variation Names and Prices (comma-separated)' })
                        summary.failed++
                        continue
                    }

                    if (names.length !== prices.length) {
                        errors.push({ row: rowNumber, error: `Mismatch: ${names.length} variation names but ${prices.length} prices` })
                        summary.failed++
                        continue
                    }

                    variations = names.map((name, index) => ({
                        id: String(index + 1),
                        name: name,
                        price: parseInt(prices[index]) || 0,
                        stock: null,
                        sku: null,
                        is_default: index === 0
                    }))
                }

                // Build description JSON
                const descriptionObj = {
                    productDescription: description,
                    productDetails: details,
                    careInstructions: careInstructions
                }

                // Parse categories
                const categoryList = categories
                    ? categories.split(',').map(c => c.trim()).filter(c => c)
                    : []

                // Parse images
                const imageList = images
                    ? images.split(',').map(url => url.trim()).filter(url => url)
                    : []

                // Prepare product data
                const productData: Record<string, unknown> = {
                    name,
                    description: JSON.stringify(descriptionObj),
                    categories: categoryList,
                    images: imageList,
                    product_type: productType,
                    price: productType === 'simple' ? parseInt(priceStr) : null,
                    variations
                }

                // Check if ID exists and product needs to be updated
                if (rowId && !isNaN(rowId)) {
                    const { data: existingProduct } = await supabase
                        .from('product')
                        .select('id')
                        .eq('id', rowId)
                        .single()

                    if (existingProduct) {
                        const { error: updateError } = await supabase
                            .from('product')
                            .update(productData)
                            .eq('id', rowId)

                        if (updateError) {
                            errors.push({ row: rowNumber, error: `Update failed: ${updateError.message}` })
                            summary.failed++
                        } else {
                            summary.updated++
                        }
                    } else {
                        const { error: insertError } = await supabase
                            .from('product')
                            .insert(productData)

                        if (insertError) {
                            errors.push({ row: rowNumber, error: `Insert failed: ${insertError.message}` })
                            summary.failed++
                        } else {
                            summary.created++
                        }
                    }
                } else {
                    const { error: insertError } = await supabase
                        .from('product')
                        .insert(productData)

                    if (insertError) {
                        errors.push({ row: rowNumber, error: `Insert failed: ${insertError.message}` })
                        summary.failed++
                    } else {
                        summary.created++
                    }
                }
            } catch (rowError) {
                errors.push({
                    row: rowNumber,
                    error: rowError instanceof Error ? rowError.message : 'Unknown error'
                })
                summary.failed++
            }
        }

        // Revalidate cached pages
        revalidatePath('/api/products')
        revalidatePath('/products')
        revalidatePath('/admin/products')

        return NextResponse.json({
            success: true,
            summary,
            errors: errors.length > 0 ? errors : undefined
        })

    } catch (error) {
        console.error('Import error:', error)
        return NextResponse.json(
            {
                error: 'Failed to process import',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
