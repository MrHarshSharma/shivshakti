'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Navbar() {
    const { toggleCart, cartCount } = useCart()
    const { user, loginWithGoogle, logout, isAdmin } = useAuth()
    const [showProfilePopup, setShowProfilePopup] = useState(false)

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-orange-100/50 bg-[#FEFBF5]/80 backdrop-blur-md transition-all shadow-sm">
            <div className="container mx-auto flex h-24 items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" className="relative h-16 md:h-20 md:w-40 transition-opacity hover:opacity-80" style={{ width: '65px', borderRadius: '100%', overflow: "hidden" }}>
                    <Image
                        src="/image.png"
                        alt="Shivshakti Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-12 text-sm font-bold tracking-[0.15em] text-[#4A3737]">
                    <Link href="/products" className="hover:text-magenta transition-colors uppercase border-b-2 border-transparent hover:border-magenta py-1">
                        Products
                    </Link>
                    <Link href="/about" className="hover:text-saffron transition-colors uppercase border-b-2 border-transparent hover:border-saffron py-1">
                        About
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" className="hover:text-saffron transition-colors uppercase border-b-2 border-transparent hover:border-saffron py-1">
                            Dashboard
                        </Link>
                    )}
                    {user && !isAdmin && (
                        <Link href="/my-orders" className="hover:text-magenta transition-colors uppercase border-b-2 border-transparent hover:border-magenta py-1">
                            My Orders
                        </Link>
                    )}
                </div>

                {/* Icons */}
                <div className="flex items-center gap-4">
                    {/* Auth Section */}
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowProfilePopup(!showProfilePopup)}
                                className="relative flex items-center gap-2 text-[#4A3737] hover:text-saffron transition-colors bg-white rounded-full shadow-sm hover:shadow-md border border-orange-100"
                            >
                                {user.user_metadata.avatar_url ? (
                                    <div className="relative h-10 w-10 rounded-full overflow-hidden border border-orange-100">
                                        <Image
                                            src={user.user_metadata.avatar_url}
                                            alt={user.user_metadata.full_name || 'User'}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <User className="h-5 w-5" />
                                )}
                            </button>

                            {/* Profile Popup */}
                            <AnimatePresence>
                                {showProfilePopup && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowProfilePopup(false)}
                                        />

                                        {/* Popup */}
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="fixed top-20 right-6 w-72 bg-white rounded-lg shadow-xl border border-orange-100 p-6 z-50"
                                        >
                                            <div className="flex items-center gap-4 mb-4 border-b border-orange-100 pb-4">
                                                {user.user_metadata.avatar_url && (
                                                    <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-saffron/20">
                                                        <Image
                                                            src={user.user_metadata.avatar_url}
                                                            alt={user.user_metadata.full_name || 'User'}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-cinzel text-sm font-bold text-[#2D1B1B] truncate">
                                                        {user.user_metadata.full_name || 'Shivshakti Customer'}
                                                    </h3>
                                                    <p className="text-[10px] text-[#4A3737] truncate opacity-60 tracking-tighter">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <button
                                                    onClick={() => {
                                                        logout()
                                                        setShowProfilePopup(false)
                                                    }}
                                                    className="w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-md transition-colors uppercase tracking-widest border border-red-100"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <button
                            onClick={() => loginWithGoogle()}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 text-[#4A3737] rounded-full text-xs font-bold hover:bg-orange-50 transition-all shadow-sm hover:shadow-md uppercase tracking-wider"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Login
                        </button>
                    )}

                    {/* Cart Icon */}
                    <button
                        onClick={toggleCart}
                        className="relative text-[#4A3737] hover:text-saffron transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md border border-orange-100"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 ? (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-magenta text-[10px] font-bold text-white shadow-sm">
                                {cartCount}
                            </span>
                        ) : (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-magenta text-[10px] font-bold text-white shadow-sm">
                                0
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </nav >
    )
}
