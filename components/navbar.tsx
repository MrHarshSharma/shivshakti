'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, Menu, X } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const { toggleCart, cartCount } = useCart()
    const { user, loginWithGoogle, logout, isAdmin, loading } = useAuth()
    const [showProfilePopup, setShowProfilePopup] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    const navLinks = [
        { name: 'Products', href: '/products', activeColor: 'text-saffron', hoverColor: 'hover:text-saffron' },
        { name: 'About', href: '/about', activeColor: 'text-saffron', hoverColor: 'hover:text-saffron' },
    ]

    return (
        <>
            <nav className="fixed top-0 z-50 w-full border-b border-orange-100/50 bg-[#FEFBF5]/80 backdrop-blur-md transition-all shadow-sm">
                <div className="container mx-auto flex h-24 items-center justify-between px-6">
                    {/* Logo */}
                    <Link href="/" className="relative h-16 w-16 rounded-full overflow-hidden transition-opacity hover:opacity-80 shadow-sm border border-orange-50">
                        <Image
                            src="/image.png"
                            alt="Shivshakti Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-12 text-sm font-black tracking-[0.2em] text-[#2D1B1B]">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`transition-all duration-300 uppercase border-b-2 py-1 ${pathname === link.href ? `${link.activeColor} border-current` : 'text-[#4A3737]/80 border-transparent'} ${link.hoverColor} hover:border-current`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {isAdmin && (
                            <Link href="/admin" className={`transition-all duration-300 uppercase border-b-2 py-1 font-black ${pathname === '/admin' ? 'text-saffron border-saffron' : 'text-[#4A3737]/80 border-transparent hover:text-saffron hover:border-saffron'}`}>
                                Dashboard
                            </Link>
                        )}
                        {user && !isAdmin && (
                            <Link href="/my-orders" className={`transition-all duration-300 uppercase border-b-2 py-1 font-black ${pathname === '/my-orders' ? 'text-saffron border-saffron' : 'text-[#4A3737]/80 border-transparent hover:text-saffron hover:border-saffron'}`}>
                                My Orders
                            </Link>
                        )}
                    </div>

                    {/* Icons & Mobile Toggle */}
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* User Profile */}
                        {loading ? (
                            <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-orange-50/50 animate-pulse border border-orange-100" />
                        ) : user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfilePopup(!showProfilePopup)}
                                    className="relative flex items-center gap-2 text-[#4A3737] bg-white rounded-full shadow-sm hover:shadow-md border border-orange-100 transition-all duration-300"
                                >
                                    {user.user_metadata.avatar_url ? (
                                        <div className="relative h-9 w-9 md:h-10 md:w-10 rounded-full overflow-hidden border border-orange-100">
                                            <Image
                                                src={user.user_metadata.avatar_url}
                                                alt={user.user_metadata.full_name || 'User'}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="p-2.5 text-[#4A3737]">
                                            <User className="h-4.5 w-4.5 md:h-5 md:w-5" />
                                        </div>
                                    )}
                                </button>

                                {/* Profile Popup */}
                                <AnimatePresence>
                                    {showProfilePopup && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowProfilePopup(false)} />
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                className="absolute top-14 right-0 w-64 bg-white rounded-2xl shadow-xl border border-orange-100 p-6 z-50"
                                            >
                                                <div className="flex items-center gap-4 mb-5 border-b border-orange-50 pb-5">
                                                    {user.user_metadata.avatar_url && (
                                                        <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-saffron/20 shadow-sm">
                                                            <Image src={user.user_metadata.avatar_url} alt="Profile" fill className="object-cover" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <h3 className="font-cinzel text-[11px] font-black text-[#2D1B1B] truncate uppercase tracking-wider">{user.user_metadata.full_name || 'Shivshakti Member'}</h3>
                                                        <p className="text-[9px] text-[#4A3737]/50 truncate tracking-tight italic font-playfair">{user.email}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => { logout(); setShowProfilePopup(false); }} className="w-full py-2.5 text-[10px] font-black text-[#4A3737]/60 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all uppercase tracking-[0.2em] border border-orange-100 font-cinzel">Sign Out</button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <button
                                onClick={() => loginWithGoogle()}
                                className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-white border border-orange-200 text-[#2D1B1B] rounded-full text-[9px] md:text-[10px] font-black hover:bg-orange-50 transition-all shadow-sm hover:shadow-md uppercase tracking-[0.1em] md:tracking-[0.15em]"
                            >
                                <svg className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" viewBox="0 0 24 24">
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
                                <span className="hidden min-[380px]:inline">SIGN IN</span>
                                <span className="min-[380px]:hidden">LOGIN</span>
                            </button>
                        )}

                        {/* Cart Icon */}
                        <button
                            onClick={toggleCart}
                            className="relative text-[#4A3737] bg-white p-2.5 rounded-full shadow-sm hover:shadow-md border border-orange-100 transition-all duration-300"
                        >
                            <ShoppingCart className="h-4.5 w-4.5 md:h-5 md:w-5" />
                            <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-saffron text-[9px] font-black text-white shadow-sm ring-2 ring-[#FEFBF5]">
                                {cartCount}
                            </span>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="md:hidden relative text-[#2D1B1B] bg-white p-2.5 rounded-full shadow-sm border border-orange-100 hover:shadow-md transition-all duration-300"
                        >
                            <Menu className="h-4.5 w-4.5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Fullscreen Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-[#FEFBF5] md:hidden flex flex-col"
                    >
                        {/* Decorative Top Accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-saffron via-saffron to-saffron" />

                        {/* Menu Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col">
                            {/* Top Header & Close Button */}
                            <div className="flex items-center justify-between mb-12">
                                <p className="font-playfair italic text-[#4A3737]/30 tracking-[0.2em] text-[10px] uppercase">
                                    Heritage Archives
                                </p>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-3 bg-white rounded-full shadow-lg border border-orange-100 text-[#4A3737] active:scale-95 transition-all"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="w-full max-w-sm">
                                <div className="flex flex-col gap-10 w-full mb-16 pl-2">
                                    {navLinks.map((link, idx) => (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * (idx + 1) }}
                                        >
                                            <Link
                                                onClick={() => setIsMenuOpen(false)}
                                                href={link.href}
                                                className={`group flex items-end gap-4 font-cinzel text-3xl font-black transition-all ${pathname === link.href ? link.activeColor : 'text-[#4A3737] active:text-saffron'}`}
                                            >
                                                {link.name}
                                            </Link>
                                        </motion.div>
                                    ))}

                                    {isAdmin && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <Link
                                                onClick={() => setIsMenuOpen(false)}
                                                href="/admin"
                                                className={`group flex items-end gap-4 font-cinzel text-3xl font-black transition-all ${pathname === '/admin' ? 'text-saffron' : 'text-[#4A3737] hover:text-saffron'}`}
                                            >
                                                Dashboard
                                            </Link>
                                        </motion.div>
                                    )}

                                    {user && !isAdmin && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <Link
                                                onClick={() => setIsMenuOpen(false)}
                                                href="/my-orders"
                                                className={`group flex items-end gap-4 font-cinzel text-3xl font-black transition-all ${pathname === '/my-orders' ? 'text-saffron' : 'text-[#4A3737] hover:text-saffron'}`}
                                            >
                                                My Orders
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>

                            </div>

                            <div className="mt-auto pb-8 pt-12 flex justify-center">
                                <p className="font-playfair italic text-[#4A3737]/30 tracking-[0.3em] text-[10px] uppercase">
                                    Est. Shivshakti Heritage Luxury
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
