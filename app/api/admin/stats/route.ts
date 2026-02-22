import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = createServiceRoleClient()

        // Run all queries in parallel for maximum speed
        const [ordersResult, productsCountResult] = await Promise.all([
            // Get only status and order total for stats calculation
            supabase
                .from('orders')
                .select('status, order'),

            // Get just the count of products (much faster than fetching all)
            supabase
                .from('product')
                .select('id', { count: 'exact', head: true })
        ])

        if (ordersResult.error) {
            throw new Error(`Orders error: ${ordersResult.error.message}`)
        }

        if (productsCountResult.error) {
            throw new Error(`Products error: ${productsCountResult.error.message}`)
        }

        const orders = ordersResult.data || []
        const totalProducts = productsCountResult.count || 0

        // Calculate stats from orders
        const totalRevenue = orders.reduce((sum, order) => {
            const orderData = order.order as { total?: number } | null
            return sum + (orderData?.total || 0)
        }, 0)

        const pendingOrders = orders.filter(order => order.status === 'pending').length

        return NextResponse.json({
            success: true,
            stats: {
                totalOrders: orders.length,
                pendingOrders,
                totalRevenue,
                totalProducts
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
