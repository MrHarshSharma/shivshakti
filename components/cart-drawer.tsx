'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, CheckCircle, Ticket, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { sendOrderConfirmationEmail } from '@/utils/emailjs'
import { loadRazorpayScript, type RazorpayResponse } from '@/utils/razorpay'

export default function CartDrawer() {
    const { isCartOpen, toggleCart, items, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
    const { user, loginWithGoogle } = useAuth()
    const searchParams = useSearchParams()
    const [isOrderPlaced, setIsOrderPlaced] = useState(false)
    const [showCustomerForm, setShowCustomerForm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [customerData, setCustomerData] = useState({
        name: '',
        phone: '',
        address: ''
    })
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        address: ''
    })
    const [submitError, setSubmitError] = useState('')

    // Coupon logic
    const [couponCode, setCouponCode] = useState('')
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; off_percent: string; discountAmount: number } | null>(null)
    const [couponError, setCouponError] = useState('')

    const finalTotal = cartTotal - (appliedCoupon?.discountAmount || 0)

    // Auto-open cart if redirected with cart=open
    useEffect(() => {
        if (searchParams.get('cart') === 'open' && !isCartOpen) {
            toggleCart()
            // Cleanup URL
            const url = new URL(window.location.href)
            url.searchParams.delete('cart')
            window.history.replaceState({}, '', url.pathname + url.search)
        }
    }, [searchParams, isCartOpen, toggleCart])

    // Load customer data from localStorage on mount and when user changes
    useEffect(() => {
        if (user) {
            // Priority 1: Data associated with this specific user email
            const savedUserData = localStorage.getItem(`shivshakti_customer_${user.email}`)
            if (savedUserData) {
                try {
                    const parsedData = JSON.parse(savedUserData)
                    setCustomerData(prev => ({
                        ...parsedData,
                        name: user.user_metadata.full_name || parsedData.name || ''
                    }))
                    return
                } catch (e) { console.error(e) }
            }

            // Priority 2: Pre-fill name from Auth if no saved data
            setCustomerData(prev => ({
                ...prev,
                name: user.user_metadata.full_name || ''
            }))
        } else {
            // Clear if logged out (or keep global? User said store in local storage)
            const globalData = localStorage.getItem('shivshakti_customer_data')
            if (globalData) {
                try {
                    setCustomerData(JSON.parse(globalData))
                } catch (e) { console.error(e) }
            }
        }
    }, [user])

    const validateForm = () => {
        const newErrors = {
            name: '',
            phone: '',
            address: ''
        }
        let isValid = true

        if (!customerData.name.trim()) {
            newErrors.name = 'Name is required'
            isValid = false
        }

        if (!customerData.phone.trim()) {
            newErrors.phone = 'Phone number is required'
            isValid = false
        } else if (!/^\d{10}$/.test(customerData.phone)) {
            newErrors.phone = 'Phone number must be exactly 10 digits'
            isValid = false
        }

        if (!customerData.address.trim()) {
            newErrors.address = 'Address is required'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleProceedToCheckout = () => {
        if (!user) {
            loginWithGoogle(window.location.pathname + '?cart=open')
            return
        }
        setShowCustomerForm(true)
    }

    const handleBackToCart = () => {
        setShowCustomerForm(false)
        setErrors({ name: '', phone: '', address: '' })
        setSubmitError('')
    }

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return
        setIsApplyingCoupon(true)
        setCouponError('')
        setAppliedCoupon(null)

        try {
            const response = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, cartTotal })
            })
            const data = await response.json()

            if (data.success) {
                setAppliedCoupon(data.coupon)
                setCouponCode('') // Clear input after successful apply
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

    const removeCoupon = () => {
        setAppliedCoupon(null)
        setCouponError('')
    }

    const handleCheckout = async () => {
        if (!validateForm()) return
        if (!user) {
            setSubmitError('Please login to place an order')
            return
        }

        setIsSubmitting(true)
        setSubmitError('')

        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript()
            if (!scriptLoaded) {
                throw new Error('Failed to load Razorpay. Please try again.')
            }

            // Create Razorpay order
            const orderResponse = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: finalTotal,
                    currency: 'INR',
                    customerName: customerData.name,
                    customerPhone: customerData.phone,
                    customerEmail: user.email,
                }),
            })

            const orderData = await orderResponse.json()

            if (!orderResponse.ok) {
                throw new Error(orderData.error || 'Failed to create payment order')
            }

            // Configure Razorpay checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Shivshakti',
                description: 'Order Payment',
                order_id: orderData.orderId,
                prefill: {
                    name: customerData.name,
                    contact: customerData.phone,
                    email: user.email,
                },
                theme: {
                    color: '#D97706', // saffron color
                },
                handler: async (response: RazorpayResponse) => {
                    try {
                        // Verify payment
                        const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        })

                        const verifyData = await verifyResponse.json()

                        if (!verifyResponse.ok || !verifyData.verified) {
                            throw new Error('Payment verification failed')
                        }

                        // Create order after successful payment
                        const createOrderResponse = await fetch('/api/orders', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                name: customerData.name,
                                phone: customerData.phone,
                                address: customerData.address,
                                email: user.email,
                                user_id: user.id,
                                items: items,
                                discount: appliedCoupon?.discountAmount || 0,
                                coupon_code: appliedCoupon?.code || null,
                                total: finalTotal,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                            }),
                        })

                        const createOrderData = await createOrderResponse.json()

                        if (!createOrderResponse.ok) {
                            throw new Error(createOrderData.error || 'Failed to create order')
                        }

                        // Send order confirmation email (don't block on failure)
                        sendOrderConfirmationEmail({
                            name: customerData.name,
                            order_id: createOrderData.orderId,
                            orders: items.map(item => ({
                                name: item.name,
                                price: item.price,
                                units: item.quantity
                            })),
                            cost: {
                                total: finalTotal,
                                subtotal: cartTotal,
                                discount: appliedCoupon?.discountAmount || 0,
                                shipping: 0,
                                tax: 0
                            }
                        }).catch(err => console.error('Email sending failed:', err))

                        // Save customer data to localStorage (both global and per-user)
                        localStorage.setItem('shivshakti_customer_data', JSON.stringify(customerData))
                        localStorage.setItem(`shivshakti_customer_${user.email}`, JSON.stringify(customerData))

                        // Dispatch custom event to notify navbar (if still needed, though auth context handles mostly)
                        window.dispatchEvent(new Event('customerDataUpdated'))

                        // Show success message
                        setIsOrderPlaced(true)
                        setIsSubmitting(false)
                        clearCart()
                        setTimeout(() => {
                            setIsOrderPlaced(false)
                            setShowCustomerForm(false)
                            toggleCart()
                        }, 3000)

                    } catch (error) {
                        console.error('Order creation error:', error)
                        setSubmitError(error instanceof Error ? error.message : 'Failed to complete order. Please contact support.')
                        setIsSubmitting(false)
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsSubmitting(false)
                        setSubmitError('Payment cancelled. Please try again.')
                    }
                }
            }

            // Open Razorpay checkout
            const razorpay = new (window as any).Razorpay(options)
            razorpay.open()

        } catch (error) {
            console.error('Payment initialization error:', error)
            setSubmitError(error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.')
            setIsSubmitting(false)
        }
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
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#FEFBF5] shadow-2xl z-[70] flex flex-col border-l border-orange-100"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-orange-100 flex items-center justify-between">
                            <h2 className="font-cinzel text-2xl text-[#2D1B1B]">Shopping Cart</h2>
                            <button onClick={toggleCart} className="p-2 hover:bg-orange-100 rounded-full transition-colors text-[#4A3737]">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {isOrderPlaced ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    >
                                        <CheckCircle className="h-24 w-24 text-emerald-500" />
                                    </motion.div>
                                    <div>
                                        <h3 className="font-cinzel text-2xl text-[#2D1B1B] mb-2">Order Placed!</h3>
                                        <p className="font-playfair text-[#4A3737]">Thank you for shopping with Shivshakti.</p>
                                    </div>
                                </div>
                            ) : showCustomerForm ? (
                                <div className="h-full flex flex-col justify-center space-y-6">
                                    <div>
                                        <h3 className="font-cinzel text-2xl text-[#2D1B1B] mb-2">Customer Information</h3>
                                        <p className="font-playfair text-sm text-[#4A3737]">Please provide your details to complete the order</p>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Name Field */}
                                        <div>
                                            <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={customerData.name}
                                                onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                                                className={`w-full px-4 py-3 border rounded-lg font-playfair focus:outline-none focus:ring-2 transition-all ${errors.name
                                                    ? 'border-red-400 focus:ring-red-200 bg-red-50'
                                                    : 'border-orange-200 focus:ring-saffron/20 bg-white'
                                                    }`}
                                                placeholder="Enter your full name"
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-xs mt-1 font-playfair">{errors.name}</p>
                                            )}
                                        </div>

                                        {/* Phone Field */}
                                        <div>
                                            <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                value={customerData.phone}
                                                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                                className={`w-full px-4 py-3 border rounded-lg font-playfair focus:outline-none focus:ring-2 transition-all ${errors.phone
                                                    ? 'border-red-400 focus:ring-red-200 bg-red-50'
                                                    : 'border-orange-200 focus:ring-saffron/20 bg-white'
                                                    }`}
                                                placeholder="10-digit phone number"
                                                maxLength={10}
                                            />
                                            {errors.phone && (
                                                <p className="text-red-500 text-xs mt-1 font-playfair">{errors.phone}</p>
                                            )}
                                        </div>

                                        {/* Address Field */}
                                        <div>
                                            <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                                                Delivery Address *
                                            </label>
                                            <textarea
                                                value={customerData.address}
                                                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                                                className={`w-full px-4 py-3 border rounded-lg font-playfair focus:outline-none focus:ring-2 transition-all resize-none ${errors.address
                                                    ? 'border-red-400 focus:ring-red-200 bg-red-50'
                                                    : 'border-orange-200 focus:ring-saffron/20 bg-white'
                                                    }`}
                                                placeholder="Enter your complete delivery address"
                                                rows={3}
                                            />
                                            {errors.address && (
                                                <p className="text-red-500 text-xs mt-1 font-playfair">{errors.address}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {submitError && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <p className="text-red-600 text-sm font-playfair">{submitError}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={handleBackToCart}
                                            disabled={isSubmitting}
                                            className="flex-1 py-3 border-2 border-[#2D1B1B] text-[#2D1B1B] font-bold uppercase tracking-widest hover:bg-[#2D1B1B] hover:text-white transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleCheckout}
                                            disabled={isSubmitting}
                                            className="flex-1 py-3 bg-[#2D1B1B] text-white font-bold uppercase tracking-widest hover:bg-saffron transition-colors shadow-lg rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? 'Placing Order...' : 'Place Order'}
                                        </button>
                                    </div>
                                </div>
                            ) : items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                                    <ShoppingBag className="h-16 w-16 text-saffron" />
                                    <p className="font-playfair text-xl text-[#4A3737]">Your cart is empty</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative h-24 w-24 bg-white rounded-lg overflow-hidden border border-orange-50 shrink-0">
                                            <Image
                                                src={(item.images && item.images.length > 0) ? item.images[0] : (item as any).image || '/placeholder-product.png'}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-playfair text-[#2D1B1B] font-bold leading-tight mb-1">{item.name}</h3>
                                                <p className="text-saffron text-sm font-bold uppercase tracking-wider">
                                                    {(item.categories && item.categories.length > 0) ? item.categories[0] : (item as any).category || 'General'}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-full border border-orange-100 shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:text-magenta transition-colors disabled:opacity-30"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center text-[#4A3737]">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:text-saffron transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-[#2D1B1B]">₹{item.price * item.quantity}</p>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-400 hover:text-red-600 underline mt-1">
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {!isOrderPlaced && !showCustomerForm && items.length > 0 && (
                            <div className="p-6 border-t border-orange-100 bg-white space-y-4">
                                {/* Coupon Section */}
                                {!appliedCoupon ? (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#4A3737]/40" />
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    placeholder="COUPON CODE"
                                                    className="w-full pl-10 pr-4 py-2 bg-orange-50/50 border border-orange-100 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-saffron/30 transition-all placeholder:font-normal placeholder:opacity-50"
                                                />
                                            </div>
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={isApplyingCoupon || !couponCode.trim()}
                                                className="px-4 py-2 bg-[#2D1B1B] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-saffron transition-all disabled:opacity-50"
                                            >
                                                {isApplyingCoupon ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Apply'}
                                            </button>
                                        </div>
                                        {couponError && (
                                            <p className="text-red-500 text-[10px] font-bold px-1">{couponError}</p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Ticket className="h-4 w-4 text-green-600" />
                                            <div>
                                                <p className="text-[10px] font-black text-green-700 uppercase">{appliedCoupon.code} APPLIED</p>
                                                <p className="text-[10px] text-green-600 font-playfair">{appliedCoupon.off_percent}% OFF SAVED ₹{appliedCoupon.discountAmount}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={removeCoupon}
                                            className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}

                                <div className="pt-2 space-y-2">
                                    <div className="flex justify-between items-center text-sm font-playfair text-[#4A3737]">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal}</span>
                                    </div>
                                    {appliedCoupon && (
                                        <div className="flex justify-between items-center text-sm font-playfair text-green-600">
                                            <span>Coupon Saving</span>
                                            <span>-₹{appliedCoupon.discountAmount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-2 border-t border-orange-100">
                                        <span className="font-playfair text-lg font-bold text-[#2D1B1B]">Total</span>
                                        <span className="font-cinzel text-2xl font-bold text-[#2D1B1B]">₹{finalTotal}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleProceedToCheckout}
                                    className="w-full py-4 bg-[#2D1B1B] text-white font-bold uppercase tracking-widest hover:bg-saffron transition-colors shadow-lg rounded-sm flex items-center justify-center gap-2"
                                >
                                    {!user && (
                                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="white"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="white"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                fill="white"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="white"
                                            />
                                        </svg>
                                    )}
                                    {user ? 'Proceed to Checkout' : 'Login with Google to Order'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
