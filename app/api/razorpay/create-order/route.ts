import Razorpay from 'razorpay'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { amount, currency = 'INR', customerName, customerPhone } = body

        // Validate required fields
        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            )
        }

        // Initialize Razorpay instance
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        })

        // Create Razorpay order
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency,
            receipt: `receipt_${Date.now()}`,
            notes: {
                customer_name: customerName,
                customer_phone: customerPhone,
            },
        }

        const order = await razorpay.orders.create(options)

        return NextResponse.json(
            {
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Razorpay order creation error:', error)
        return NextResponse.json(
            {
                error: 'Failed to create Razorpay order',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        )
    }
}
