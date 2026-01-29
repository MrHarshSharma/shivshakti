import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    const { nextUrl } = request
    const response = await updateSession(request)

    // Protect all /admin routes and sensitive admin APIs
    const isAdminRoute = nextUrl.pathname.startsWith('/admin')
    const isUserOrderRoute = nextUrl.pathname.startsWith('/my-orders')
    const isAdminApi = nextUrl.pathname.startsWith('/api/orders/list') ||
        (nextUrl.pathname.startsWith('/api/orders/') && request.method === 'PATCH') ||
        (nextUrl.pathname.startsWith('/api/products') && request.method !== 'GET') ||
        nextUrl.pathname.startsWith('/api/upload-images')

    if (isAdminRoute || isAdminApi || isUserOrderRoute) {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            request.cookies.set(name, value)
                        )
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser()
        const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').split(',').map(e => e.trim())

        // 1. Basic Auth Check for User Routes
        if (!user && isUserOrderRoute) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // 2. Admin Check for Admin Routes/APIs
        if (isAdminRoute || isAdminApi) {
            if (!user || !user.email || !adminEmails.includes(user.email)) {
                // For API routes, return a JSON error
                if (isAdminApi) {
                    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
                }
                // For page routes, redirect to home
                return NextResponse.redirect(new URL('/', request.url))
            }
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
