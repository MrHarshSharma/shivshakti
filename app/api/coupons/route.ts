
import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'

/**
 * Handle GET requests to fetch all coupons
 */
export async function GET() {
    try {
        const supabase = createServiceRoleClient()
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching coupons:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, coupons: data })
    } catch (error: any) {
        console.error('API Error (GET /api/coupons):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Handle POST requests to create a new coupon
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient()
        const body = await request.json()
        const { code, valid_from, valid_till, off_percent, min_cost } = body

        if (!code || !valid_from || !valid_till || !off_percent) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('coupons')
            .insert([{ code, valid_from, valid_till, off_percent, min_cost }])
            .select()

        if (error) {
            console.error('Error creating coupon:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, coupon: data[0] })
    } catch (error: any) {
        console.error('API Error (POST /api/coupons):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Handle PATCH requests to update an existing coupon
 */
export async function PATCH(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient()
        const body = await request.json()
        const { id, code, valid_from, valid_till, off_percent, min_cost } = body

        if (!id) {
            return NextResponse.json({ success: false, error: 'Missing coupon ID' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('coupons')
            .update({ code, valid_from, valid_till, off_percent, min_cost })
            .eq('id', id)
            .select()

        if (error) {
            console.error('Error updating coupon:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, coupon: data[0] })
    } catch (error: any) {
        console.error('API Error (PATCH /api/coupons):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Handle DELETE requests to remove a coupon
 */
export async function DELETE(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ success: false, error: 'Missing coupon ID' }, { status: 400 })
        }

        const { error } = await supabase
            .from('coupons')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting coupon:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('API Error (DELETE /api/coupons):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
