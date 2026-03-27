'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User, Session } from '@supabase/supabase-js'

type AuthContextType = {
    user: User | null
    session: Session | null
    loading: boolean
    isAdmin: boolean
    isEditor: boolean
    userRole: string | null
    loginWithGoogle: (nextPath?: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [userRole, setUserRole] = useState<string | null>(null)
    const supabase = createClient()

    const fetchUserRole = async (email: string) => {
        try {
            const { data } = await supabase
                .from('users')
                .select('user_roles')
                .eq('email', email.toLowerCase())
                .single()
            setUserRole(data?.user_roles || 'user')
        } catch {
            setUserRole('user')
        }
    }

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user?.email) {
                await fetchUserRole(session.user.email)
            }
            setLoading(false)
        }

        getSession()

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user?.email) {
                fetchUserRole(session.user.email)
            } else {
                setUserRole(null)
            }
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    const loginWithGoogle = async (nextPath?: string) => {
        const origin = window.location.origin
        const redirectTo = nextPath
            ? `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
            : `${origin}/auth/callback`

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo,
            },
        })
        if (error) console.error('Error logging in with Google:', error.message)
    }

    const logout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) console.error('Error logging out:', error.message)
        if (window.location.pathname.startsWith('/admin')) {
            window.location.href = '/'
        }
    }

    const isAdmin = !!(user?.email && process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(',').map(e => e.trim()).includes(user.email))
    const isEditor = isAdmin || userRole === 'admin' || userRole === 'editor'

    return (
        <AuthContext.Provider value={{ user, session, loading, isAdmin, isEditor, userRole, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
