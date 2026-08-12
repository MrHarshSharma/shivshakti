import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { status, tracking_id } = body

        if (!status) {
            return NextResponse.json(
                { error: 'Status is required' },
                { status: 400 }
            )
        }

        const supabase = createServiceRoleClient()

        // Build update object
        const updateData: { status: string; tracking_id?: string; order?: Record<string, unknown> } = { status }
        if (tracking_id) {
            updateData.tracking_id = tracking_id
        }

        // Dispatch settles the delivery fee: the team rings the customer with the
        // amount before shipping, so by this point the question is closed. Latch it
        // in the stored order rather than hiding it in the UI — that way the "fee
        // pending" flag cannot reappear if the status later moves on again.
        if (status === 'shipped') {
            const { data: existing } = await supabase
                .from('orders')
                .select('order')
                .eq('id', id)
                .single()

            const currentOrder = existing?.order as Record<string, unknown> | undefined
            const delivery = currentOrder?.delivery as Record<string, unknown> | undefined

            if (delivery?.fee_status === 'pending_confirmation') {
                updateData.order = {
                    ...currentOrder,
                    delivery: { ...delivery, fee_status: 'settled' }
                }
            }
        }

        const { data, error } = await supabase
            .from('orders')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Failed to update order status', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                order: data,
                message: 'Order status updated successfully'
            },
            { status: 200 }
        )

    } catch (error) {
        console.error('Order status update error:', error)
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
