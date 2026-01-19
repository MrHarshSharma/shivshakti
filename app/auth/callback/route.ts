import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in search params, use it as the redirection URL after successful sign in
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error && data.user) {
            const user = data.user
            // Sync user data to 'users' table
            try {
                const { createServiceRoleClient } = await import('@/utils/supabase/service-role')
                const serviceRole = createServiceRoleClient()
                await serviceRole
                    .from('users')
                    .upsert({
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata.full_name,
                        avatar_url: user.user_metadata.avatar_url,
                        last_login: new Date().toISOString()
                    }, { onConflict: 'id' })
            } catch (syncError) {
                console.error('Error syncing user data:', syncError)
                // Don't block login if sync fails
            }

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // we can be sure that there is no proxy in between
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
