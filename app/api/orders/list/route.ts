import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = createServiceRoleClient()

        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Failed to fetch orders', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                orders: data
            },
            { status: 200 }
        )

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
