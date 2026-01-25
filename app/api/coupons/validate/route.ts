
import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'

export async function POST(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient()
        const body = await request.json()
        const { code, cartTotal } = body

        if (!code) {
            return NextResponse.json({ success: false, error: 'Coupon code is required' }, { status: 400 })
        }

        // 1. Fetch coupon
        const { data: coupon, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', code.toUpperCase())
            .single()

        if (error || !coupon) {
            return NextResponse.json({ success: false, error: 'Invalid coupon code' }, { status: 404 })
        }

        // 2. Validate Date
        const today = new Date().toISOString().split('T')[0]
        if (today < coupon.valid_from) {
            return NextResponse.json({ success: false, error: `This coupon is valid from ${coupon.valid_from}` }, { status: 400 })
        }
        if (today > coupon.valid_till) {
            return NextResponse.json({ success: false, error: 'This coupon has expired' }, { status: 400 })
        }

        // 3. Validate Minimum Spend
        const minSpend = parseFloat(coupon.min_cost || '0')
        if (cartTotal < minSpend) {
            return NextResponse.json({
                success: false,
                error: `Minimum spend of ₹${minSpend} required for this coupon`
            }, { status: 400 })
        }

        // 4. Calculate Discount
        const offPercent = parseFloat(coupon.off_percent)
        const discountAmount = Math.round((cartTotal * offPercent) / 100)

        return NextResponse.json({
            success: true,
            coupon: {
                code: coupon.code,
                off_percent: coupon.off_percent,
                discountAmount: discountAmount
            },
            message: 'Coupon applied successfully!'
        })

    } catch (error: any) {
        console.error('API Error (POST /api/coupons/validate):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
