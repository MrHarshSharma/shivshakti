import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'
import ExcelJS from 'exceljs'

async function fetchImageAsBuffer(url: string): Promise<{ buffer: Buffer; extension: 'png' | 'jpeg' | 'gif' } | null> {
    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
        if (!res.ok) return null
        const contentType = res.headers.get('content-type') || ''
        let extension: 'png' | 'jpeg' | 'gif' = 'jpeg'
        if (contentType.includes('png')) extension = 'png'
        else if (contentType.includes('gif')) extension = 'gif'
        const arrayBuffer = await res.arrayBuffer()
        return { buffer: Buffer.from(arrayBuffer), extension }
    } catch {
        return null
    }
}

export async function GET() {
    try {
        const supabase = createServiceRoleClient()

        const { data: products, error } = await supabase
            .from('product')
            .select('id, name, description, price, categories, images, product_type, variations')
            .order('id', { ascending: true })

        if (error) {
            console.error('Error fetching products:', error)
            return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
        }

        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet('Products')

        // Define columns
        // 1 inch = 96px for ext, 1 inch = 72 points for row height
        const IMAGE_WIDTH_INCHES = 1.75
        const IMAGE_HEIGHT_INCHES = 2.7
        const IMAGE_WIDTH_PX = Math.round(IMAGE_WIDTH_INCHES * 96)   // 168px
        const IMAGE_HEIGHT_PX = Math.round(IMAGE_HEIGHT_INCHES * 96) // 259px
        const IMAGE_COL_WIDTH = Math.round(IMAGE_WIDTH_INCHES * 96 / 7) // ~24 chars

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 8 },
            { header: 'Product Name', key: 'name', width: 30 },
            { header: 'Description', key: 'description', width: 50 },
            { header: 'Details', key: 'details', width: 40 },
            { header: 'Care Instructions', key: 'care', width: 35 },
            { header: 'Price', key: 'price', width: 10 },
            { header: 'Categories', key: 'categories', width: 25 },
            { header: 'Type', key: 'type', width: 10 },
            { header: 'Variation Names', key: 'variationNames', width: 25 },
            { header: 'Variation Prices', key: 'variationPrices', width: 25 },
            { header: 'Image URLs', key: 'imageUrls', width: 50 },
            { header: 'Image Preview', key: 'imagePreview', width: IMAGE_COL_WIDTH },
        ]

        // Style header row
        const headerRow = worksheet.getRow(1)
        headerRow.font = { bold: true }
        headerRow.alignment = { vertical: 'middle' }

        const rows = products && products.length > 0 ? products : null

        if (!rows) {
            // Sample data when database is empty
            worksheet.addRow({
                id: '',
                name: 'Gift Hamper Deluxe',
                description: 'A beautiful gift hamper with assorted items',
                details: 'Contains chocolates, dry fruits, and cookies',
                care: 'Store in a cool dry place',
                price: 1500,
                categories: 'Hampers, Gourmet',
                type: 'simple',
                variationNames: '',
                variationPrices: '',
                imageUrls: '',
                imagePreview: '',
            })
            worksheet.addRow({
                id: '',
                name: 'Premium Almonds',
                description: 'California almonds, fresh and crunchy',
                details: 'Grade A quality almonds',
                care: 'Keep sealed after opening',
                price: '',
                categories: 'Dry fruits',
                type: 'variable',
                variationNames: '250g, 500g, 1kg',
                variationPrices: '350, 650, 1200',
                imageUrls: '',
                imagePreview: '',
            })
        } else {
            for (let i = 0; i < rows.length; i++) {
                const product = rows[i]

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

                // Variations
                let variationNames = ''
                let variationPrices = ''
                if (product.product_type === 'variable' && product.variations?.length > 0) {
                    variationNames = product.variations.map((v: { name?: string }) => v.name || '').join(', ')
                    variationPrices = product.variations.map((v: { price?: number }) => v.price || '').join(', ')
                }

                const imageUrls = (product.images || []).join(', ')

                const row = worksheet.addRow({
                    id: product.id,
                    name: product.name || '',
                    description: productDescription,
                    details: productDetails,
                    care: careInstructions,
                    price: product.price || '',
                    categories: (product.categories || []).join(', '),
                    type: product.product_type === 'variable' ? 'variable' : 'simple',
                    variationNames,
                    variationPrices,
                    imageUrls,
                    imagePreview: '',
                })

                // Embed first image if available
                const firstImageUrl = product.images?.[0]
                if (firstImageUrl) {
                    const imageData = await fetchImageAsBuffer(firstImageUrl)
                    if (imageData) {
                        const imageId = workbook.addImage({
                            buffer: imageData.buffer as unknown as ExcelJS.Buffer,
                            extension: imageData.extension,
                        })

                        const rowIndex = i + 1 // +1 because header is row 0 in 0-based
                        // ExcelJS row height: ~0.75px per point
                        row.height = IMAGE_HEIGHT_PX * 0.75

                        worksheet.addImage(imageId, {
                            tl: { col: 11, row: rowIndex },
                            ext: { width: IMAGE_WIDTH_PX, height: IMAGE_HEIGHT_PX },
                        })
                    }
                }
            }
        }

        const buffer = await workbook.xlsx.writeBuffer()

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename="product-import-template.xlsx"',
            },
        })
    } catch (error) {
        console.error('Template generation error:', error)
        return NextResponse.json({ error: 'Failed to generate template' }, { status: 500 })
    }
}
