import { createClient } from '@/utils/supabase/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()

        // 1. Verify User Session
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // 2. Fetch Order to Verify Ownership and Status
        // We use the regular client here to respect RLS (user can only see their own orders)
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('user_id, status')
            .eq('id', id)
            .single()

        if (fetchError || !order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        // 3. Verify Ownership (Double check)
        if (order.user_id !== user.id) {
            return NextResponse.json(
                { error: 'Forbidden: You do not own this order' },
                { status: 403 }
            )
        }

        // 4. Verify Status (Strict 'pending' check)
        if (order.status !== 'pending') {
            return NextResponse.json(
                { error: 'Order cannot be cancelled. Only pending orders can be cancelled.' },
                { status: 400 }
            )
        }

        // 5. Update Status to 'cancelled'
        // We use the Service Role client here because RLS might block 'UPDATE' for users
        // even if they own the row.
        const adminSupabase = createServiceRoleClient()
        const { data: updatedOrder, error: updateError } = await adminSupabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .select()
            .single()

        if (updateError) {
            console.error('Error cancelling order:', updateError)
            return NextResponse.json(
                { error: 'Failed to cancel order' },
                { status: 500 }
            )
        }

        // Send email notification to Admin
        try {
            const { sendOrderCancellationEmail } = await import('@/utils/admin-email')
            await sendOrderCancellationEmail({
                order_id: parseInt(id),
                user_email: user.email || 'Unknown User'
            })
        } catch (emailError) {
            console.error('Failed to send cancellation notification:', emailError)
            // Function continues, email failure shouldn't block response
        }

        return NextResponse.json({
            success: true,
            order: updatedOrder,
            message: 'Order cancelled successfully'
        })

    } catch (error) {
        console.error('Order cancellation error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
