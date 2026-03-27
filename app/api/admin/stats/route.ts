import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = createServiceRoleClient()

        // Run all queries in parallel for maximum speed
        const [
            totalOrdersResult,
            pendingOrdersResult,
            revenueResult,
            productsCountResult
        ] = await Promise.all([
            // Count total orders (no data transfer, just count)
            supabase
                .from('orders')
                .select('id', { count: 'exact', head: true }),

            // Count pending orders (no data transfer, just count)
            supabase
                .from('orders')
                .select('id', { count: 'exact', head: true })
                .eq('status', 'pending'),

            // Get total revenue via database function (single value, no row transfer)
            supabase.rpc('get_total_revenue'),

            // Count products (no data transfer, just count)
            supabase
                .from('product')
                .select('id', { count: 'exact', head: true })
        ])

        if (totalOrdersResult.error) throw new Error(`Orders count error: ${totalOrdersResult.error.message}`)
        if (pendingOrdersResult.error) throw new Error(`Pending count error: ${pendingOrdersResult.error.message}`)
        if (revenueResult.error) throw new Error(`Revenue error: ${revenueResult.error.message}`)
        if (productsCountResult.error) throw new Error(`Products error: ${productsCountResult.error.message}`)

        const totalRevenue = revenueResult.data || 0

        return NextResponse.json({
            success: true,
            stats: {
                totalOrders: totalOrdersResult.count || 0,
                pendingOrders: pendingOrdersResult.count || 0,
                totalRevenue,
                totalProducts: productsCountResult.count || 0
            }
        })

    } catch (error) {
        console.error('Admin stats error:', error)
        return NextResponse.json(
            {
                error: 'Failed to fetch admin stats',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
