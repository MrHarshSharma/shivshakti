import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, phone, address, items, razorpay_order_id, razorpay_payment_id } = body

        // Validate required fields
        if (!name || !phone || !address || !items || items.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate payment information
        if (!razorpay_order_id || !razorpay_payment_id) {
            return NextResponse.json(
                { error: 'Payment information is required' },
                { status: 400 }
            )
        }

        // Create Supabase client with service role (bypasses RLS)
        const supabase = createServiceRoleClient()

        // Prepare order data
        const orderData = {
            name,
            phone,
            address,
            order: {
                items: items.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                total: items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
                itemCount: items.reduce((sum: number, item: any) => sum + item.quantity, 0)
            },
            status: 'pending',
            payment_status: 'completed',
            razorpay_order_id,
            razorpay_payment_id
        }

        // Insert order into database
        const { data, error } = await supabase
            .from('orders')
            .insert(orderData)
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Failed to create order', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                orderId: data.id,
                message: 'Order placed successfully'
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Order submission error:', error)
        console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
