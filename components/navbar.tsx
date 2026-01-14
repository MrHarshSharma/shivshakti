'use client'

import Link from 'next/link'
import { ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Navbar() {
    const { toggleCart, cartCount } = useCart()
    const [showProfilePopup, setShowProfilePopup] = useState(false)
    const [customerData, setCustomerData] = useState<{
        name: string
        phone: string
        address: string
    } | null>(null)

    // Load customer data from localStorage
    useEffect(() => {
        const loadCustomerData = () => {
            const savedCustomerData = localStorage.getItem('shivshakti_customer_data')
            if (savedCustomerData) {
                try {
                    const parsedData = JSON.parse(savedCustomerData)
                    setCustomerData(parsedData)
                } catch (error) {
                    console.error('Error loading customer data:', error)
                }
            }
        }

        // Load on mount
        loadCustomerData()

        // Listen for storage changes (when data is saved from cart drawer)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'shivshakti_customer_data') {
                loadCustomerData()
            }
        }

        // Listen for custom event (for same-window updates)
        const handleCustomerDataUpdate = () => {
            loadCustomerData()
        }

        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('customerDataUpdated', handleCustomerDataUpdate)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('customerDataUpdated', handleCustomerDataUpdate)
        }
    }, [])

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-orange-100/50 bg-[#FEFBF5]/80 backdrop-blur-md transition-all shadow-sm">
            <div className="container mx-auto flex h-24 items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" className="font-cinzel text-xl md:text-3xl font-bold tracking-widest text-[#2D1B1B] hover:text-saffron transition-colors drop-shadow-sm">
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
                    {/* Profile Icon - Only show if customer data exists */}
                    {customerData && (
                        <div className="relative">
                            <button
                                onClick={() => setShowProfilePopup(!showProfilePopup)}
                                className="relative text-[#4A3737] hover:text-saffron transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md"
                            >
                                <User className="h-5 w-5" />
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
                                            className="fixed top-20 right-6 w-80 bg-white rounded-lg shadow-xl border border-orange-100 p-6 z-50"
                                        >
                                            <h3 className="font-cinzel text-lg font-bold text-[#2D1B1B] mb-4 border-b border-orange-100 pb-2">
                                                Customer Profile
                                            </h3>

                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs font-bold text-[#4A3737] uppercase tracking-wider mb-1">Name</p>
                                                    <p className="font-playfair text-[#2D1B1B]">{customerData.name}</p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-bold text-[#4A3737] uppercase tracking-wider mb-1">Phone</p>
                                                    <p className="font-playfair text-[#2D1B1B]">{customerData.phone}</p>
                                                </div>

                                                <div>
                                                    <p className="text-xs font-bold text-[#4A3737] uppercase tracking-wider mb-1">Address</p>
                                                    <p className="font-playfair text-[#2D1B1B] text-sm leading-relaxed">{customerData.address}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Cart Icon */}
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
