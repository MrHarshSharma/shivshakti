'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, User, Menu, X, ChevronDown, Search } from 'lucide-react'
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

    useEffect(() => {
        setIsMenuOpen(false)
    }, [pathname])

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/products' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ]

    return (
        <>
            {/* Top Banner */}
            <div className="bg-[#D29B6C] text-white text-center py-2 text-xs font-medium tracking-wide">
                Free Shipping on orders above ₹999 | Use code WELCOME10 for 10% off
            </div>

            <nav className="sticky top-0 z-50 bg-white border-b border-[#EBEBEB]">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0">
                            <div className="relative h-12 w-32">
                                <Image
                                    src="/logo.png"
                                    alt="Shivshakti"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors hover:text-[#D29B6C] ${
                                        pathname === link.href ? 'text-[#D29B6C]' : 'text-[#4A4A4A]'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className={`text-sm font-medium transition-colors hover:text-[#D29B6C] ${
                                        pathname === '/admin' ? 'text-[#D29B6C]' : 'text-[#4A4A4A]'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                            )}
                            {user && !isAdmin && (
                                <Link
                                    href="/my-orders"
                                    className={`text-sm font-medium transition-colors hover:text-[#D29B6C] ${
                                        pathname === '/my-orders' ? 'text-[#D29B6C]' : 'text-[#4A4A4A]'
                                    }`}
                                >
                                    My Orders
                                </Link>
                            )}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {/* User */}
                            {loading ? (
                                <div className="w-10 h-10 rounded-full bg-[#F3F3F3] animate-pulse" />
                            ) : user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfilePopup(!showProfilePopup)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F8F8F8] transition-colors"
                                    >
                                        {user.user_metadata.avatar_url ? (
                                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                                <Image
                                                    src={user.user_metadata.avatar_url}
                                                    alt="Profile"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-[#D29B6C] flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">
                                                    {user.user_metadata.full_name?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                        )}
                                        <ChevronDown className="w-4 h-4 text-[#717171] hidden md:block" />
                                    </button>

                                    <AnimatePresence>
                                        {showProfilePopup && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setShowProfilePopup(false)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 8 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#EBEBEB] py-2 z-50"
                                                >
                                                    <div className="px-4 py-3 border-b border-[#EBEBEB]">
                                                        <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                                                            {user.user_metadata.full_name || 'Welcome!'}
                                                        </p>
                                                        <p className="text-xs text-[#717171] truncate mt-0.5">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                    {!isAdmin && (
                                                        <Link
                                                            href="/my-orders"
                                                            onClick={() => setShowProfilePopup(false)}
                                                            className="block px-4 py-2.5 text-sm text-[#4A4A4A] hover:bg-[#F8F8F8] transition-colors"
                                                        >
                                                            My Orders
                                                        </Link>
                                                    )}
                                                    {isAdmin && (
                                                        <Link
                                                            href="/admin"
                                                            onClick={() => setShowProfilePopup(false)}
                                                            className="block px-4 py-2.5 text-sm text-[#4A4A4A] hover:bg-[#F8F8F8] transition-colors"
                                                        >
                                                            Admin Dashboard
                                                        </Link>
                                                    )}
                                                    <button
                                                        onClick={() => { logout(); setShowProfilePopup(false); }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-[#D0021B] hover:bg-[#EBDDC4] transition-colors"
                                                    >
                                                        Sign Out
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <button
                                    onClick={() => loginWithGoogle()}
                                    className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#4A4A4A] hover:text-[#D29B6C] transition-colors"
                                >
                                    <User className="w-5 h-5" />
                                    Login
                                </button>
                            )}

                            {/* Cart */}
                            <button
                                onClick={toggleCart}
                                className="relative flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-[#F8F8F8] transition-colors"
                            >
                                <ShoppingBag className="w-5 h-5 text-[#4A4A4A]" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D29B6C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Menu */}
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="md:hidden p-2 rounded-lg hover:bg-[#F8F8F8] transition-colors"
                            >
                                <Menu className="w-6 h-6 text-[#4A4A4A]" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-[60]"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-[70] shadow-xl"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-[#EBEBEB]">
                                <span className="text-lg font-semibold text-[#1A1A1A]">Menu</span>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 rounded-lg hover:bg-[#F8F8F8] transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* User Section */}
                            {!loading && (
                                <div className="p-4 border-b border-[#EBEBEB]">
                                    {user ? (
                                        <div className="flex items-center gap-3">
                                            {user.user_metadata.avatar_url ? (
                                                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                                    <Image src={user.user_metadata.avatar_url} alt="Profile" fill className="object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-[#D29B6C] flex items-center justify-center">
                                                    <span className="text-white text-lg font-medium">
                                                        {user.user_metadata.full_name?.charAt(0) || 'U'}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-[#1A1A1A] truncate">
                                                    {user.user_metadata.full_name || 'Welcome!'}
                                                </p>
                                                <p className="text-xs text-[#717171] truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => { loginWithGoogle(); setIsMenuOpen(false); }}
                                            className="w-full py-3 bg-[#D29B6C] text-white text-sm font-semibold rounded-lg hover:bg-[#B8845A] transition-colors"
                                        >
                                            Sign In with Google
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Navigation Links */}
                            <div className="py-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block px-4 py-3 text-sm font-medium transition-colors ${
                                            pathname === link.href
                                                ? 'text-[#D29B6C] bg-[#EBDDC4]'
                                                : 'text-[#4A4A4A] hover:bg-[#F8F8F8]'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                {user && !isAdmin && (
                                    <Link
                                        href="/my-orders"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block px-4 py-3 text-sm font-medium transition-colors ${
                                            pathname === '/my-orders'
                                                ? 'text-[#D29B6C] bg-[#EBDDC4]'
                                                : 'text-[#4A4A4A] hover:bg-[#F8F8F8]'
                                        }`}
                                    >
                                        My Orders
                                    </Link>
                                )}
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block px-4 py-3 text-sm font-medium transition-colors ${
                                            pathname === '/admin'
                                                ? 'text-[#D29B6C] bg-[#EBDDC4]'
                                                : 'text-[#4A4A4A] hover:bg-[#F8F8F8]'
                                        }`}
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}
                            </div>

                            {/* Sign Out */}
                            {user && (
                                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#EBEBEB]">
                                    <button
                                        onClick={() => { logout(); setIsMenuOpen(false); }}
                                        className="w-full py-3 text-sm font-medium text-[#D0021B] border border-[#D0021B] rounded-lg hover:bg-[#EBDDC4] transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
