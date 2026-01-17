import crypto from 'crypto'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: 'Missing payment verification parameters' },
                { status: 400 }
            )
        }

        // Generate signature for verification
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        // Verify signature
        const isValid = generatedSignature === razorpay_signature

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid payment signature', verified: false },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                verified: true,
                message: 'Payment verified successfully',
            },
            { status: 200 }
        )
    } catch (error) {
        console.error('Payment verification error:', error)
        return NextResponse.json(
            {
                error: 'Failed to verify payment',
                details: error instanceof Error ? error.message : 'Unknown error',
                verified: false,
            },
            { status: 500 }
        )
    }
}
