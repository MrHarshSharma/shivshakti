import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Disable static caching - always fetch fresh data
export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        if (!id || id === 'undefined') {
            return NextResponse.json(
                { error: 'Invalid product ID' },
                { status: 400 }
            )
        }

        const supabase = createServiceRoleClient()

        const { data, error } = await supabase
            .from('product')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Failed to fetch product', details: error.message },
                { status: 404 }
            )
        }

        return NextResponse.json({ success: true, product: data })

    } catch (error) {
        console.error('Product fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        if (!id || id === 'undefined') {
            return NextResponse.json(
                { error: 'Invalid product ID' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { name, description, price, categories, images, product_type, variations } = body

        console.log('Update Request for ID:', id, 'Payload:', { name, product_type, imagesCount: images?.length })

        // Validate required fields
        if (!name || !description || !images || images.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate product type specific requirements
        if (product_type === 'simple' && price === undefined) {
            return NextResponse.json(
                { error: 'Price is required for simple products' },
                { status: 400 }
            )
        }

        if (product_type === 'variable' && (!variations || variations.length === 0)) {
            return NextResponse.json(
                { error: 'At least one variation is required for variable products' },
                { status: 400 }
            )
        }

        const supabase = createServiceRoleClient()

        const productData: any = {
            name,
            description,
            categories: categories || [],
            images: images,
            product_type: product_type || 'simple',
        }

        // Add price for simple products
        if (product_type === 'simple') {
            productData.price = parseInt(price.toString())
        } else {
            productData.price = null
        }

        // Add variations for variable products
        if (product_type === 'variable') {
            productData.variations = variations
        }

        const { data, error } = await supabase
            .from('product')
            .update(productData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Supabase update error:', error)
            return NextResponse.json(
                { error: 'Failed to update product', details: error.message },
                { status: 500 }
            )
        }

        console.log('Update Successful for ID:', id)

        // Revalidate cached pages after update
        revalidatePath(`/api/products/${id}`)
        revalidatePath('/api/products')
        revalidatePath('/products')
        revalidatePath(`/products/${id}`)
        revalidatePath('/admin/products')

        return NextResponse.json({
            success: true,
            message: 'Product updated successfully',
            product: data
        })

    } catch (error) {
        console.error('Product update error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        if (!id || id === 'undefined') {
            return NextResponse.json(
                { error: 'Invalid product ID' },
                { status: 400 }
            )
        }

        const supabase = createServiceRoleClient()

        const { error } = await supabase
            .from('product')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Failed to delete product', details: error.message },
                { status: 500 }
            )
        }

        // Revalidate cached pages after delete
        revalidatePath('/api/products')
        revalidatePath('/products')
        revalidatePath('/admin/products')

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully'
        })

    } catch (error) {
        console.error('Product deletion error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
