import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'
import * as XLSX from 'xlsx'

export async function GET() {
    try {
        const supabase = createServiceRoleClient()

        // Fetch all products from database ordered by ID ascending
        const { data: products, error } = await supabase
            .from('product')
            .select('id, name, description, price, categories, images, product_type, variations')
            .order('id', { ascending: true })

        if (error) {
            console.error('Error fetching products:', error)
            return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
        }

        // Transform products for Excel export - one row per product
        const data: Array<Record<string, unknown>> = []

        products?.forEach(product => {
            // Parse description JSON
            let productDescription = ''
            let productDetails = ''
            let careInstructions = ''

            try {
                const descObj = JSON.parse(product.description || '{}')
                productDescription = descObj.productDescription || ''
                productDetails = descObj.productDetails || ''
                careInstructions = descObj.careInstructions || ''
            } catch {
                productDescription = product.description || ''
            }

            // For variable products, combine variations into comma-separated strings
            let variationNames = ''
            let variationPrices = ''

            if (product.product_type === 'variable' && product.variations && product.variations.length > 0) {
                variationNames = product.variations.map((v: { name?: string }) => v.name || '').join(', ')
                variationPrices = product.variations.map((v: { price?: number }) => v.price || '').join(', ')
            }

            data.push({
                'ID': product.id,
                'Product Name': product.name || '',
                'Description': productDescription,
                'Details': productDetails,
                'Care Instructions': careInstructions,
                'Price': product.price || '',
                'Categories': (product.categories || []).join(', '),
                'Type': product.product_type === 'variable' ? 'variable' : 'simple',
                'Variation Names': variationNames,
                'Variation Prices': variationPrices,
                'Image URLs': (product.images || []).join(', ')
            })
        })

        // Add sample rows if database is empty
        if (data.length === 0) {
            data.push({
                'ID': '',
                'Product Name': 'Gift Hamper Deluxe',
                'Description': 'A beautiful gift hamper with assorted items',
                'Details': 'Contains chocolates, dry fruits, and cookies',
                'Care Instructions': 'Store in a cool dry place',
                'Price': 1500,
                'Categories': 'Hampers, Gourmet',
                'Type': 'simple',
                'Variation Names': '',
                'Variation Prices': '',
                'Image URLs': ''
            })
            data.push({
                'ID': '',
                'Product Name': 'Premium Almonds',
                'Description': 'California almonds, fresh and crunchy',
                'Details': 'Grade A quality almonds',
                'Care Instructions': 'Keep sealed after opening',
                'Price': '',
                'Categories': 'Dry fruits',
                'Type': 'variable',
                'Variation Names': '250g, 500g, 1kg',
                'Variation Prices': '350, 650, 1200',
                'Image URLs': ''
            })
        }

        // Create workbook and worksheet
        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(data)

        // Set column widths
        worksheet['!cols'] = [
            { wch: 8 },   // ID
            { wch: 30 },  // Product Name
            { wch: 50 },  // Description
            { wch: 40 },  // Details
            { wch: 35 },  // Care Instructions
            { wch: 10 },  // Price
            { wch: 25 },  // Categories
            { wch: 10 },  // Type
            { wch: 25 },  // Variation Names
            { wch: 25 },  // Variation Prices
            { wch: 50 }   // Image URLs
        ]

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Products')

        // Generate buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

        // Return as downloadable file
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="product-import-template.xlsx"'
            }
        })

    } catch (error) {
        console.error('Template generation error:', error)
        return NextResponse.json(
            { error: 'Failed to generate template' },
            { status: 500 }
        )
    }
}
