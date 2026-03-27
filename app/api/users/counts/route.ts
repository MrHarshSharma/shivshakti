import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'

const SUPER_ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').split(',').map(e => e.trim().toLowerCase())

/**
 * Handle GET requests to fetch user counts by role
 * Query params: search (optional) - to get counts filtered by search
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient()
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')?.toLowerCase() || ''

        const roles = ['admin', 'editor', 'user', 'blocked']
        const counts: Record<string, number> = {}

        // Fetch count for each role
        for (const role of roles) {
            let query = supabase
                .from('users')
                .select('id', { count: 'exact', head: true })
                .eq('user_roles', role)

            // Apply search filter if provided
            if (search) {
                query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
            }

            // Exclude super admins
            for (const adminEmail of SUPER_ADMIN_EMAILS) {
                if (adminEmail) {
                    query = query.neq('email', adminEmail)
                }
            }

            const { count, error } = await query

            if (error) {
                console.error(`Error fetching count for role ${role}:`, error)
                counts[role] = 0
            } else {
                counts[role] = count || 0
            }
        }

        // Also get total count
        let totalQuery = supabase
            .from('users')
            .select('id', { count: 'exact', head: true })

        if (search) {
            totalQuery = totalQuery.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
        }

        for (const adminEmail of SUPER_ADMIN_EMAILS) {
            if (adminEmail) {
                totalQuery = totalQuery.neq('email', adminEmail)
            }
        }

        const { count: totalCount } = await totalQuery

        return NextResponse.json({
            success: true,
            counts: {
                ...counts,
                total: totalCount || 0
            }
        })
    } catch (error: any) {
        console.error('API Error (GET /api/users/counts):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
