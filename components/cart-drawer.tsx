'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Ticket, Loader2, Trash2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FREE_DELIVERY_RADIUS_KM } from '@/utils/delivery'

/**
 * The bag. Reviewing and adjusting items happens here; everything that needs the
 * customer's details — address, fulfilment choice, payment — lives on /checkout.
 */
export default function CartDrawer() {
    const {
        isCartOpen, toggleCart, items, removeFromCart, updateQuantity, cartTotal,
        appliedCoupon, setAppliedCoupon, discountAmount, finalTotal,
    } = useCart()
    const { user, loginWithGoogle } = useAuth()
    const searchParams = useSearchParams()
    const router = useRouter()

    const [couponCode, setCouponCode] = useState('')
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
    const [couponError, setCouponError] = useState('')

    // Auto-open cart if redirected with cart=open
    useEffect(() => {
        if (searchParams.get('cart') === 'open' && !isCartOpen) {
            toggleCart()
            const url = new URL(window.location.href)
            url.searchParams.delete('cart')
            window.history.replaceState({}, '', url.pathname + url.search)
        }
    }, [searchParams, isCartOpen, toggleCart])

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return
        setIsApplyingCoupon(true)
        setCouponError('')

        try {
            const response = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, cartTotal, user_id: user?.id }),
            })
            const data = await response.json()

            if (data.success) {
                setAppliedCoupon({
                    code: data.coupon.code,
                    off_percent: parseFloat(data.coupon.off_percent),
                    min_cost: data.coupon.min_cost,
                })
                setCouponCode('')
            } else {
                setCouponError(data.error || 'Failed to apply coupon')
            }
        } catch (err) {
            console.error('Error applying coupon:', err)
            setCouponError('Something went wrong. Please try again.')
        } finally {
            setIsApplyingCoupon(false)
        }
    }

    const handleProceedToCheckout = () => {
        // Sign-in is required to place an order, so ask for it before the customer
        // invests time in the checkout form. /checkout guards this again anyway.
        if (!user) {
            loginWithGoogle('/checkout')
            return
        }
        toggleCart()
        router.push('/checkout')
    }

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/50 z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-[#EBEBEB] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="h-5 w-5 text-[#D29B6C]" />
                                <h2 className="text-lg font-semibold text-[#1A1A1A]">Shopping Bag</h2>
                                {items.length > 0 && (
                                    <span className="px-2 py-0.5 bg-[#F8F8F8] text-[#717171] text-xs font-medium rounded-full">
                                        {items.length} {items.length === 1 ? 'item' : 'items'}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={toggleCart}
                                className="p-2 hover:bg-[#F8F8F8] rounded-lg transition-colors text-[#717171]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                                    <div className="w-20 h-20 bg-[#F8F8F8] rounded-full flex items-center justify-center">
                                        <ShoppingBag className="h-8 w-8 text-[#717171]" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-[#1A1A1A] mb-1">Your bag is empty</p>
                                        <p className="text-sm text-[#717171]">Add items to get started</p>
                                    </div>
                                    <button
                                        onClick={toggleCart}
                                        className="px-6 py-2.5 bg-[#D29B6C] text-white font-medium rounded-lg hover:bg-[#B8845A] transition-colors"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 space-y-4">
                                    {items.map((item) => (
                                        <div key={`${item.id}-${item.selectedVariation?.id || 'default'}`} className="flex gap-4 p-3 bg-[#F8F8F8] rounded-xl">
                                            <div className="relative h-20 w-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={(item.images && item.images.length > 0) ? item.images[0] : (item as any).image || '/placeholder-product.png'}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-[#1A1A1A] line-clamp-1 mb-0.5">{item.name}</h3>
                                                <div className="flex items-center gap-2 mb-2">
                                                    {item.selectedVariation && (
                                                        <span className="text-xs text-[#717171]">
                                                            {item.selectedVariation.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1 bg-white rounded-lg border border-[#EBEBEB]">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedVariation?.id)}
                                                            className="p-1.5 hover:bg-[#F8F8F8] transition-colors text-[#717171] hover:text-[#D29B6C] rounded-l-lg"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-medium text-[#1A1A1A]">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariation?.id)}
                                                            className="p-1.5 hover:bg-[#F8F8F8] transition-colors text-[#717171] hover:text-[#D29B6C] rounded-r-lg"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                    <p className="font-semibold text-[#1A1A1A]">
                                                        ₹{((item.selectedVariation ? item.selectedVariation.price : item.price) * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id, item.selectedVariation?.id)}
                                                className="self-start p-1.5 text-[#717171] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-4 border-t border-[#EBEBEB] bg-white space-y-4">
                                {/* Coupon */}
                                {!appliedCoupon ? (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    placeholder="Enter coupon code"
                                                    className="w-full px-4 py-2.5 bg-[#F8F8F8] border border-[#EBEBEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D29B6C]/20 focus:border-[#D29B6C] transition-all"
                                                />
                                            </div>
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={isApplyingCoupon || !couponCode.trim()}
                                                className="px-4 py-2.5 bg-[#1A1A1A] text-white text-sm font-medium rounded-lg hover:bg-black transition-all disabled:opacity-50"
                                            >
                                                {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                                            </button>
                                        </div>
                                        {couponError && (
                                            <p className="text-red-500 text-xs">{couponError}</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Ticket className="h-4 w-4 text-emerald-600" />
                                            <div>
                                                <p className="text-xs font-semibold text-emerald-700">{appliedCoupon.code}</p>
                                                <p className="text-xs text-emerald-600">{appliedCoupon.off_percent}% off - Saved ₹{discountAmount}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { setAppliedCoupon(null); setCouponError('') }}
                                            className="text-xs font-medium text-red-500 hover:text-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}

                                {/* Totals */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm text-[#717171]">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between items-center text-sm text-emerald-600">
                                            <span>Discount</span>
                                            <span>-₹{discountAmount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-2 border-t border-[#EBEBEB]">
                                        <span className="font-medium text-[#1A1A1A]">Total</span>
                                        <span className="text-xl font-bold text-[#1A1A1A]">₹{finalTotal.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-[#717171]">
                                        Delivery is free within {FREE_DELIVERY_RADIUS_KM} km — confirmed at checkout.
                                    </p>
                                </div>

                                <button
                                    onClick={handleProceedToCheckout}
                                    className="w-full py-3.5 bg-[#D29B6C] text-white font-semibold rounded-lg hover:bg-[#B8845A] transition-colors flex items-center justify-center gap-2"
                                >
                                    {!user && (
                                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white" />
                                        </svg>
                                    )}
                                    {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                                    {user && <ArrowRight className="h-4 w-4" />}
                                </button>

                                {user && (
                                    <button
                                        onClick={() => { toggleCart(); router.push('/cart') }}
                                        className="w-full text-center text-sm text-[#717171] hover:text-[#1A1A1A] transition-colors"
                                    >
                                        View full cart
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
