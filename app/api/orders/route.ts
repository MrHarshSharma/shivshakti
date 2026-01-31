import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, phone, address, items, razorpay_order_id, razorpay_payment_id, email, user_id, is_delivery, payment_status } = body

        // Validate required fields
        if (!name || !phone || !address || !items || items.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate payment information (Only if not store payment)
        if (payment_status !== 'store payment' && (!razorpay_order_id || !razorpay_payment_id)) {
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
            email,
            user_id,
            order: {
                items: items.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    category: (item.categories && item.categories.length > 0) ? item.categories[0] : item.category || 'General',
                    price: item.price,
                    quantity: item.quantity,
                    image: (item.images && item.images.length > 0) ? item.images[0] : item.image || '/placeholder-product.png'
                })),
                total: items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
                itemCount: items.reduce((sum: number, item: any) => sum + item.quantity, 0)
            },
            status: 'pending',
            payment_status: payment_status || 'completed', // Default to completed for old flow, or use provided
            is_delivery: is_delivery !== undefined ? is_delivery : true, // Default to true if missing
            razorpay_order_id: razorpay_order_id || null,
            razorpay_payment_id: razorpay_payment_id || null
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
