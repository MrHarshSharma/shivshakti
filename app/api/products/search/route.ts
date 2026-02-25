import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    const supabase = createServiceRoleClient()

    let queryBuilder = supabase
        .from('product')
        .select('id, name, price, images, product_type, variations')
        .order('created_at', { ascending: false })

    if (query) {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    }

    const { data, error } = await queryBuilder.limit(10)

    if (error) {
        console.error('Error searching products:', error)
        return NextResponse.json({ products: [], count: 0 }, { status: 500 })
    }

    // Get total count for the search
    const { count } = await supabase
        .from('product')
        .select('*', { count: 'exact', head: true })
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    return NextResponse.json({
        products: data || [],
        count: count || 0
    })
}
