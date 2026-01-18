import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'

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
        const { name, description, price, categories, images } = body

        console.log('Update Request for ID:', id, 'Payload:', { name, price, imagesCount: images?.length })

        // Validate required fields
        if (!name || !description || price === undefined || !images || images.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const supabase = createServiceRoleClient()

        const productData = {
            name,
            description,
            price: parseInt(price.toString()),
            categories: categories || [],
            images: images,
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
