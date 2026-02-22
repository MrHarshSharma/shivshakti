import { createClient } from '@/utils/supabase/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Get pagination params
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')

        // Calculate range for pagination
        const from = (page - 1) * limit
        const to = from + limit - 1

        // Use service role to bypass RLS
        const serviceSupabase = createServiceRoleClient()

        const { data, error, count } = await serviceSupabase
            .from('orders')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id)
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
