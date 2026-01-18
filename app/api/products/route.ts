import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, description, price, categories, images } = body

        // Validate required fields
        if (!name || !description || !price || !images || images.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Create Supabase client with service role (bypasses RLS)
        const supabase = createServiceRoleClient()

        // Prepare product data
        const productData = {
            name,
            description,
            price: parseInt(price),
            categories: categories || [],
            images: images,
        }

        // Insert product into database
        const { data, error } = await supabase
            .from('product')
            .insert(productData)
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Failed to create product', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                productId: data.id,
                message: 'Product created successfully'
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Product creation error:', error)
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const supabase = createServiceRoleClient()

        const { data, error } = await supabase
            .from('product')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Failed to fetch products', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                products: data
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Product fetch error:', error)
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
