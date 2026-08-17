'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    ShoppingBag, Minus, Plus, Trash2, Ticket, Loader2, ArrowRight, ArrowLeft, Lock, ShieldAlert,
} from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import { FREE_DELIVERY_RADIUS_KM } from '@/utils/delivery'

/**
 * Full-page cart. The drawer stays for quick glances; this is the roomier view for
 * editing quantities before checkout, and it is reachable by URL.
 *
 * Middleware already bounces signed-out visitors and signs out blocked accounts, so
 * the states below are a second line — they also cover the moment before the client
 * session hydrates, when middleware has already had its say.
 */
export default function CartClient() {
    const {
        items, cartTotal, removeFromCart, updateQuantity,
        appliedCoupon, setAppliedCoupon, discountAmount, finalTotal, cartCount,
    } = useCart()
    const { user, loading, userRole, loginWithGoogle } = useAuth()
    const router = useRouter()

    const [couponCode, setCouponCode] = useState('')
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
    const [couponError, setCouponError] = useState('')

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return
        setIsApplyingCoupon(true)
        setCouponError('')

        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, cartTotal, user_id: user?.id }),
            })
            const data = await res.json()

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

    // ---- Session still resolving -------------------------------------------
    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-[#D29B6C]" />
            </div>
        )
    }

    // ---- Blocked account ---------------------------------------------------
    if (userRole === 'blocked') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="h-7 w-7 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-playfair font-semibold text-[#1A1A1A] mb-2">Account unavailable</h1>
                    <p className="text-[#717171] mb-8">
                        This account can&apos;t place orders right now. Please contact us if you think this is a mistake.
                    </p>
                    <Link href="/contact" className="inline-block px-6 py-3 bg-[#D29B6C] text-white font-medium rounded-lg hover:bg-[#B8845A] transition-colors">
                        Contact Us
                    </Link>
                </div>
            </div>
        )
    }

    // ---- Signed out --------------------------------------------------------
    if (!user) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-[#EBDDC4] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="h-7 w-7 text-[#D29B6C]" />
                    </div>
                    <h1 className="text-2xl font-playfair font-semibold text-[#1A1A1A] mb-2">Sign in to view your cart</h1>
                    <p className="text-[#717171] mb-8">
                        Signing in keeps your bag with your account and lets us send order updates.
                    </p>
                    <button
                        onClick={() => loginWithGoogle('/cart')}
                        className="w-full py-3 bg-[#D29B6C] text-white font-semibold rounded-lg hover:bg-[#B8845A] transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>
        )
    }

    // ---- Empty -------------------------------------------------------------
    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
                <div className="text-center">
                    <div className="w-20 h-20 bg-[#F8F8F8] rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="h-8 w-8 text-[#717171]" />
                    </div>
                    <h1 className="text-2xl font-playfair font-semibold text-[#1A1A1A] mb-2">Your bag is empty</h1>
                    <p className="text-[#717171] mb-8">Add something you love to get started.</p>
                    <Link href="/products" className="inline-block px-6 py-3 bg-[#D29B6C] text-white font-medium rounded-lg hover:bg-[#B8845A] transition-colors">
                        Browse Products
                    </Link>
                </div>
            </div>
        )
    }

    // ---- Cart --------------------------------------------------------------
    return (
        <div className="bg-[#FDFBF8] min-h-screen">
            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 max-w-6xl">
                <Link href="/products" className="inline-flex items-center gap-2 text-sm text-[#717171] hover:text-[#1A1A1A] transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    Continue shopping
                </Link>

                <div className="flex items-baseline gap-3 mb-8">
                    <h1 className="text-2xl lg:text-3xl font-playfair font-semibold text-[#1A1A1A]">My Cart</h1>
                    <span className="text-sm text-[#717171]">
                        {cartCount} {cartCount === 1 ? 'item' : 'items'}
                    </span>
                </div>

                <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
                    {/* Items */}
                    <div className="space-y-3">
                        {items.map(item => {
                            const unitPrice = item.selectedVariation ? item.selectedVariation.price : item.price
                            return (
                                <div
                                    key={`${item.id}-${item.selectedVariation?.id || 'default'}`}
                                    className="flex gap-4 p-4 bg-white border border-[#EBEBEB] rounded-xl"
                                >
                                    <Link href={`/product/${item.id}`} className="relative h-24 w-24 bg-[#F8F8F8] rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={(item.images && item.images.length > 0) ? item.images[0] : (item as any).image || '/placeholder-product.png'}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </Link>

                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <Link href={`/product/${item.id}`} className="text-sm font-medium text-[#1A1A1A] hover:text-[#D29B6C] transition-colors line-clamp-2">
                                                {item.name}
                                            </Link>
                                            {item.selectedVariation && (
                                                <p className="text-xs text-[#717171] mt-0.5">{item.selectedVariation.name}</p>
                                            )}
                                            <p className="text-xs text-[#717171] mt-1">₹{unitPrice.toLocaleString()} each</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center gap-1 bg-white rounded-lg border border-[#EBEBEB]">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedVariation?.id)}
                                                    disabled={item.quantity <= 1}
                                                    aria-label="Decrease quantity"
                                                    className="p-2 hover:bg-[#F8F8F8] transition-colors text-[#717171] hover:text-[#D29B6C] rounded-l-lg disabled:opacity-40"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-10 text-center text-sm font-medium text-[#1A1A1A]">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariation?.id)}
                                                    aria-label="Increase quantity"
                                                    className="p-2 hover:bg-[#F8F8F8] transition-colors text-[#717171] hover:text-[#D29B6C] rounded-r-lg"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <p className="font-semibold text-[#1A1A1A]">
                                                    ₹{(unitPrice * item.quantity).toLocaleString()}
                                                </p>
                                                <button
                                                    onClick={() => removeFromCart(item.id, item.selectedVariation?.id)}
                                                    aria-label={`Remove ${item.name}`}
                                                    className="p-1.5 text-[#717171] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Summary */}
                    <aside className="bg-white border border-[#EBEBEB] rounded-xl p-6 lg:sticky lg:top-24 space-y-5">
                        <h2 className="font-semibold text-[#1A1A1A]">Summary</h2>

                        {!appliedCoupon ? (
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="Coupon code"
                                        className="flex-1 px-4 py-2.5 bg-[#F8F8F8] border border-[#EBEBEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D29B6C]/20 focus:border-[#D29B6C]"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={isApplyingCoupon || !couponCode.trim()}
                                        className="px-4 py-2.5 bg-[#1A1A1A] text-white text-sm font-medium rounded-lg hover:bg-black transition-all disabled:opacity-50"
                                    >
                                        {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                                    </button>
                                </div>
                                {couponError && <p className="text-red-500 text-xs">{couponError}</p>}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Ticket className="h-4 w-4 text-emerald-600" />
                                    <div>
                                        <p className="text-xs font-semibold text-emerald-700">{appliedCoupon.code}</p>
                                        <p className="text-xs text-emerald-600">{appliedCoupon.off_percent}% off — saved ₹{discountAmount}</p>
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

                        <div className="space-y-2 pt-4 border-t border-[#EBEBEB]">
                            <div className="flex justify-between text-sm text-[#717171]">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between text-sm text-emerald-600">
                                    <span>Discount</span>
                                    <span>-₹{discountAmount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-3 border-t border-[#EBEBEB]">
                                <span className="font-medium text-[#1A1A1A]">Total</span>
                                <span className="text-xl font-bold text-[#1A1A1A]">₹{finalTotal.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-[#717171]">
                                Delivery is free within {FREE_DELIVERY_RADIUS_KM} km — confirmed at checkout.
                            </p>
                        </div>

                        <button
                            onClick={() => router.push('/checkout')}
                            className="w-full py-3.5 bg-[#D29B6C] text-white font-semibold rounded-lg hover:bg-[#B8845A] transition-colors flex items-center justify-center gap-2"
                        >
                            Proceed to Checkout
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </aside>
                </div>
            </div>
        </div>
    )
}
