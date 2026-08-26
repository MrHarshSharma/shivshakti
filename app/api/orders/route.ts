import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { NextResponse } from 'next/server'
import { resolvePlace } from '@/utils/places'
import { assessDelivery, FREE_DELIVERY_RADIUS_KM } from '@/utils/delivery'
import { notifyOwnerOfNewOrder } from '@/utils/whatsapp'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, phone, address, items, razorpay_order_id, razorpay_payment_id, email, user_id, is_delivery, payment_status, discount, coupon_code, total, delivery_place_id, delivery_fee_acknowledged } = body

        // Validate required fields
        if (!name || !phone || !address || !items || items.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Validate payment information. Every order — delivery or store pickup — is
        // paid online up front, so Razorpay details are always required.
        if (!razorpay_order_id || !razorpay_payment_id) {
            return NextResponse.json(
                { error: 'Payment information is required' },
                { status: 400 }
            )
        }

        // Create Supabase client with service role (bypasses RLS)
        const supabase = createServiceRoleClient()

        // Calculate subtotal from items
        const subtotal = items.reduce((sum: number, item: any) => {
            const price = item.selectedVariation ? item.selectedVariation.price : item.price;
            return sum + (price * item.quantity);
        }, 0)

        // Use provided total (with discount) or calculate from subtotal
        const finalTotal = total !== undefined ? total : subtotal

        // Work out the delivery zone here rather than trusting the client — this
        // decides whether the shop absorbs a delivery cost, so the browser doesn't
        // get a vote. We re-resolve the place ID with Google and measure ourselves.
        const isDeliveryOrder = is_delivery !== undefined ? is_delivery : true
        let deliveryMeta: Record<string, unknown>

        if (!isDeliveryOrder) {
            deliveryMeta = { mode: 'pickup', zone: 'pickup', fee_status: 'not_applicable' }
        } else {
            const resolved = delivery_place_id ? await resolvePlace(delivery_place_id) : null
            const assessment = assessDelivery(resolved)

            deliveryMeta = {
                mode: 'delivery',
                // 'unknown' when the address was typed free-hand or Google was
                // unreachable. Deliberately falls to the chargeable side.
                zone: assessment.zone,
                distance_km: assessment.distanceKm,
                free_radius_km: FREE_DELIVERY_RADIUS_KM,
                place_id: delivery_place_id || null,
                pincode: resolved?.pincode || null,
                resolved_address: resolved?.formattedAddress || null,
                fee_status: assessment.isFree ? 'free' : 'pending_confirmation',
                fee_acknowledged: delivery_fee_acknowledged ?? null,
            }
        }

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
                    price: item.selectedVariation ? item.selectedVariation.price : item.price,
                    quantity: item.quantity,
                    image: (item.images && item.images.length > 0) ? item.images[0] : item.image || '/placeholder-product.png',
                    variation: item.selectedVariation || null
                })),
                subtotal: subtotal,
                discount: discount || 0,
                coupon_code: coupon_code || null,
                total: finalTotal,
                itemCount: items.reduce((sum: number, item: any) => sum + item.quantity, 0),
                delivery: deliveryMeta
            },
            status: 'pending',
            payment_status: payment_status || 'completed', // Default to completed for old flow, or use provided
            is_delivery: isDeliveryOrder,
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

        // Alert the owner here rather than from the browser. The previous client-side
        // call ran after the payment had already succeeded and the row was committed,
        // so closing the tab lost the notification while keeping the money and the
        // order — a silent failure nobody would see. Never let it fail the response:
        // the order is paid for and saved regardless of whether the alert lands.
        try {
            await notifyOwnerOfNewOrder(data)
        } catch (notifyError) {
            console.error(`Order ${data.id} created but owner alert failed`, notifyError)
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
