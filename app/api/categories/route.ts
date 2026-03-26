import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'

/**
 * Handle GET requests to fetch all categories
 */
export async function GET() {
    try {
        const supabase = createServiceRoleClient()
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('position', { ascending: true, nullsFirst: false })
            .order('id', { ascending: true })

        if (error) {
            console.error('Error fetching categories:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, categories: data })
    } catch (error: any) {
        console.error('API Error (GET /api/categories):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Handle PUT requests to reorder categories
 */
export async function PUT(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient()
        const body = await request.json()
        const { categories } = body

        if (!categories || !Array.isArray(categories)) {
            return NextResponse.json({ success: false, error: 'Categories array is required' }, { status: 400 })
        }

        // Update each category's position
        for (let i = 0; i < categories.length; i++) {
            const { error } = await supabase
                .from('categories')
                .update({ position: i })
                .eq('id', categories[i].id)

            if (error) {
                console.error('Error updating category position:', error)
                return NextResponse.json({ success: false, error: error.message }, { status: 500 })
            }
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('API Error (PUT /api/categories):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Handle POST requests to create a new category
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient()
        const body = await request.json()
        const { category } = body

        if (!category || !category.trim()) {
            return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 })
        }

        // Get the max position to add new category at the end
        const { data: maxData } = await supabase
            .from('categories')
            .select('position')
            .order('position', { ascending: false })
            .limit(1)

        const nextPosition = (maxData && maxData[0]?.position != null) ? maxData[0].position + 1 : 0

        const { data, error } = await supabase
            .from('categories')
            .insert([{ category: category.trim(), position: nextPosition }])
            .select()

        if (error) {
            console.error('Error creating category:', error)
            if (error.code === '23505') {
                return NextResponse.json({ success: false, error: 'Category already exists' }, { status: 400 })
            }
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, category: data[0] })
    } catch (error: any) {
        console.error('API Error (POST /api/categories):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Handle PATCH requests to update an existing category
 */
export async function PATCH(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient()
        const body = await request.json()
        const { id, category } = body

        if (!id) {
            return NextResponse.json({ success: false, error: 'Missing category ID' }, { status: 400 })
        }

        if (!category || !category.trim()) {
            return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('categories')
            .update({ category: category.trim() })
            .eq('id', id)
            .select()

        if (error) {
            console.error('Error updating category:', error)
            if (error.code === '23505') {
                return NextResponse.json({ success: false, error: 'Category already exists' }, { status: 400 })
            }
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, category: data[0] })
    } catch (error: any) {
        console.error('API Error (PATCH /api/categories):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Handle DELETE requests to remove a category
 */
export async function DELETE(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ success: false, error: 'Missing category ID' }, { status: 400 })
        }

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting category:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('API Error (DELETE /api/categories):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
