import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/utils/supabase/service-role'

const SUPER_ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').split(',').map(e => e.trim().toLowerCase())

/**
 * Handle GET requests to fetch users with pagination, role filter, and search
 * Query params: role, search, page (default 1), limit (default 10)
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient()
        const { searchParams } = new URL(request.url)

        const role = searchParams.get('role') // admin, editor, user, blocked
        const search = searchParams.get('search')?.toLowerCase() || ''
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const offset = (page - 1) * limit

        // Build query for users table
        let query = supabase
            .from('users')
            .select('id, email, full_name, avatar_url, user_roles, created_at, last_login', { count: 'exact' })

        // Filter by role
        if (role && ['admin', 'editor', 'user', 'blocked'].includes(role)) {
            query = query.eq('user_roles', role)
        }

        // Filter by search (email or full_name)
        if (search) {
            query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
        }

        // Exclude super admins
        for (const adminEmail of SUPER_ADMIN_EMAILS) {
            if (adminEmail) {
                query = query.neq('email', adminEmail)
            }
        }

        // Apply pagination
        query = query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        const { data: users, error, count } = await query

        if (error) {
            console.error('Error fetching users:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        const totalCount = count || 0
        const hasMore = offset + limit < totalCount

        // Map to expected format
        const mappedUsers = (users || []).map(user => ({
            id: user.id,
            email: user.email,
            name: user.full_name || null,
            avatar: user.avatar_url || null,
            role: user.user_roles || 'user',
            created_at: user.created_at,
            last_sign_in: user.last_login
        }))

        return NextResponse.json({
            success: true,
            users: mappedUsers,
            pagination: {
                page,
                limit,
                total: totalCount,
                hasMore
            }
        })
    } catch (error: any) {
        console.error('API Error (GET /api/users):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}

/**
 * Handle PATCH requests to update a user's role
 */
export async function PATCH(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient()
        const body = await request.json()
        const { email, role } = body

        if (!email) {
            return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
        }

        if (!role || !['admin', 'editor', 'user', 'blocked'].includes(role)) {
            return NextResponse.json({ success: false, error: 'Valid role is required (admin, editor, user, blocked)' }, { status: 400 })
        }

        // Don't allow changing super admin roles
        if (SUPER_ADMIN_EMAILS.includes(email.toLowerCase())) {
            return NextResponse.json({ success: false, error: 'Cannot modify super admin role' }, { status: 403 })
        }

        // Update the user_roles column in the users table
        const { data, error } = await supabase
            .from('users')
            .update({ user_roles: role })
            .eq('email', email.toLowerCase())
            .select()

        if (error) {
            console.error('Error updating user role:', error)
            return NextResponse.json({ success: false, error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, userRole: data?.[0] })
    } catch (error: any) {
        console.error('API Error (PATCH /api/users):', error)
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
