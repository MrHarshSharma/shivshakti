'use client'

import Link from 'next/link'
import { ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/context/cart-context'

export default function Navbar() {
    const { toggleCart, cartCount } = useCart()

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-orange-100/50 bg-[#FEFBF5]/80 backdrop-blur-md transition-all shadow-sm">
            <div className="container mx-auto flex h-24 items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" className="font-cinzel text-3xl font-bold tracking-widest text-[#2D1B1B] hover:text-saffron transition-colors drop-shadow-sm">
                    SHIVSHAKTI
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-12 text-sm font-bold tracking-[0.15em] text-[#4A3737]">
                    <Link href="/products" className="hover:text-magenta transition-colors uppercase border-b-2 border-transparent hover:border-magenta py-1">
                        Hampers
                    </Link>
                    <Link href="/about" className="hover:text-saffron transition-colors uppercase border-b-2 border-transparent hover:border-saffron py-1">
                        Gourmet
                    </Link>
                    <Link href="/journal" className="hover:text-emerald transition-colors uppercase border-b-2 border-transparent hover:border-emerald py-1">
                        Corporate
                    </Link>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={toggleCart}
                        className="relative text-[#4A3737] hover:text-saffron transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-magenta text-[10px] font-bold text-white shadow-sm">
                                {cartCount}
                            </span>
                        )}
                        {cartCount === 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-magenta text-[10px] font-bold text-white shadow-sm">
                                0
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    )
}
