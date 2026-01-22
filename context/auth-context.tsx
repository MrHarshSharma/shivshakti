'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User, Session } from '@supabase/supabase-js'

type AuthContextType = {
    user: User | null
    session: Session | null
    loading: boolean
    loginWithGoogle: (nextPath?: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        }

        getSession()

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
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
    }

    return (
        <AuthContext.Provider value={{ user, session, loading, loginWithGoogle, logout }}>
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
