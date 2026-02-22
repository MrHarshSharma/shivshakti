import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)

        // Pagination params
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const search = searchParams.get('search') || ''
        const status = searchParams.get('status') || 'all'

        const supabase = createServiceRoleClient()

        // Calculate range for pagination
        const from = (page - 1) * limit
        const to = from + limit - 1

        // Build the query
        let query = supabase
            .from('orders')
            .select('*', { count: 'exact' })

        // Apply status filter
        if (status !== 'all') {
            query = query.eq('status', status)
        }

        // Apply search filter (search in name, email, phone, or id)
        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
        }

        // Apply ordering and pagination
        const { data, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to)

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Failed to fetch orders', details: error.message },
                { status: 500 }
            )
        }

        const totalPages = Math.ceil((count || 0) / limit)

        return NextResponse.json({
            success: true,
            orders: data,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages
            }
        })

    } catch (error) {
        console.error('Orders fetch error:', error)
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
