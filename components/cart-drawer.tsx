'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Check, Ticket, Loader2, Truck, Store, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { sendOrderReceivedEmail } from '@/utils/emailjs'
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
        address: '',
        isDelivery: null as boolean | null
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
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; off_percent: number; min_cost: number } | null>(null)
    const [couponError, setCouponError] = useState('')

    const discountAmount = useMemo(() => {
        if (!appliedCoupon) return 0
        return Math.round((cartTotal * appliedCoupon.off_percent) / 100)
    }, [cartTotal, appliedCoupon])

    // Validate coupon minimum spend on cart change
    useEffect(() => {
        if (appliedCoupon && cartTotal < appliedCoupon.min_cost) {
            setAppliedCoupon(null)
            setCouponError(`Coupon removed: Minimum spend of ₹${appliedCoupon.min_cost} not met`)
        }
    }, [cartTotal, appliedCoupon])

    const finalTotal = cartTotal - discountAmount

    // Auto-open cart if redirected with cart=open
    useEffect(() => {
        if (searchParams.get('cart') === 'open' && !isCartOpen) {
            toggleCart()
            const url = new URL(window.location.href)
            url.searchParams.delete('cart')
            window.history.replaceState({}, '', url.pathname + url.search)
        }
    }, [searchParams, isCartOpen, toggleCart])

    // Load customer data from localStorage on mount and when user changes
    useEffect(() => {
        if (user) {
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
            setCustomerData(prev => ({
                ...prev,
                name: user.user_metadata.full_name || ''
            }))
        } else {
            const globalData = localStorage.getItem('shivshakti_customer_data')
            if (globalData) {
                try {
                    setCustomerData(JSON.parse(globalData))
                } catch (e) { console.error(e) }
            }
        }
    }, [user])

    const validateForm = () => {
        const newErrors = { name: '', phone: '', address: '' }
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

        if (customerData.isDelivery && !customerData.address.trim()) {
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
        setCustomerData(prev => ({ ...prev, isDelivery: null }))
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
                setAppliedCoupon({
                    code: data.coupon.code,
                    off_percent: parseFloat(data.coupon.off_percent),
                    min_cost: data.coupon.min_cost
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

        if (customerData.isDelivery === false) {
            try {
                const createOrderResponse = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: customerData.name,
                        phone: customerData.phone,
                        address: 'Store Pickup',
                        email: user.email,
                        user_id: user.id,
                        items: items,
                        discount: discountAmount,
                        coupon_code: appliedCoupon?.code || null,
                        total: finalTotal,
                        payment_status: 'store payment',
                        is_delivery: false,
                    }),
                })

                const createOrderData = await createOrderResponse.json()

                if (!createOrderResponse.ok) {
                    throw new Error(createOrderData.error || 'Failed to create order')
                }

                sendOrderReceivedEmail({
                    name: customerData.name,
                    order_id: createOrderData.orderId,
                    orders: items.map(item => ({
                        name: item.selectedVariation ? `${item.name} (${item.selectedVariation.name})` : item.name,
                        price: item.selectedVariation ? item.selectedVariation.price : item.price,
                        units: item.quantity,
                        image: (item.images && item.images.length > 0) ? item.images[0] : (item as any).image || '/placeholder-product.png'
                    })),
                    cost: {
                        total: finalTotal,
                        subtotal: cartTotal,
                        discount: discountAmount,
                        shipping: 0,
                        tax: 0
                    },
                    from_name: customerData.name,
                    reply_to: user.email,
                    mode: 'Store Pickup',
                }).catch(err => console.error('Email sending failed:', err))

                localStorage.setItem('shivshakti_customer_data', JSON.stringify(customerData))
                localStorage.setItem(`shivshakti_customer_${user.email}`, JSON.stringify(customerData))
                window.dispatchEvent(new Event('customerDataUpdated'))

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
            return
        }

        try {
            const scriptLoaded = await loadRazorpayScript()
            if (!scriptLoaded) {
                throw new Error('Failed to load Razorpay. Please try again.')
            }

            const orderResponse = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                    color: '#8B1538',
                },
                handler: async (response: RazorpayResponse) => {
                    try {
                        const verifyResponse = await fetch('/api/razorpay/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
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

                        const createOrderResponse = await fetch('/api/orders', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                name: customerData.name,
                                phone: customerData.phone,
                                address: customerData.address,
                                email: user.email,
                                user_id: user.id,
                                items: items,
                                discount: discountAmount,
                                coupon_code: appliedCoupon?.code || null,
                                total: finalTotal,
                                is_delivery: true,
                                payment_status: 'completed',
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                            }),
                        })

                        const createOrderData = await createOrderResponse.json()

                        if (!createOrderResponse.ok) {
                            throw new Error(createOrderData.error || 'Failed to create order')
                        }

                        sendOrderReceivedEmail({
                            name: customerData.name,
                            order_id: createOrderData.orderId,
                            orders: items.map(item => ({
                                name: item.selectedVariation ? `${item.name} (${item.selectedVariation.name})` : item.name,
                                price: item.selectedVariation ? item.selectedVariation.price : item.price,
                                units: item.quantity,
                                image: (item.images && item.images.length > 0) ? item.images[0] : (item as any).image || '/placeholder-product.png'
                            })),
                            cost: {
                                total: finalTotal,
                                subtotal: cartTotal,
                                discount: discountAmount,
                                shipping: 0,
                                tax: 0
                            },
                            from_name: customerData.name,
                            reply_to: user.email,
                            mode: 'Doorstep Delivery',
                        }).catch(err => console.error('Email sending failed:', err))

                        localStorage.setItem('shivshakti_customer_data', JSON.stringify(customerData))
                        localStorage.setItem(`shivshakti_customer_${user.email}`, JSON.stringify(customerData))
                        window.dispatchEvent(new Event('customerDataUpdated'))

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
                                <ShoppingBag className="h-5 w-5 text-[#8B1538]" />
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
                            {isOrderPlaced ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center"
                                    >
                                        <Check className="h-10 w-10 text-emerald-500" />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1">Order Placed!</h3>
                                        <p className="text-[#717171]">Thank you for shopping with Shivshakti.</p>
                                    </div>
                                </div>
                            ) : showCustomerForm ? (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">Checkout</h3>
                                        <p className="text-sm text-[#717171]">How would you like to receive your order?</p>
                                    </div>

                                    {/* Order Type Selection */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setCustomerData({ ...customerData, isDelivery: true })}
                                            className={`relative flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${customerData.isDelivery === true
                                                ? 'border-[#8B1538] bg-[#FDF2F4]'
                                                : 'border-[#EBEBEB] bg-white hover:border-[#8B1538]/50'
                                                }`}
                                        >
                                            {customerData.isDelivery === true && (
                                                <div className="absolute top-2 right-2">
                                                    <Check className="h-4 w-4 text-[#8B1538]" />
                                                </div>
                                            )}
                                            <Truck className={`h-6 w-6 mb-2 ${customerData.isDelivery === true ? 'text-[#8B1538]' : 'text-[#717171]'}`} />
                                            <span className={`font-medium text-sm ${customerData.isDelivery === true ? 'text-[#8B1538]' : 'text-[#1A1A1A]'}`}>Delivery</span>
                                            <span className="text-xs text-[#717171] mt-0.5">To your doorstep</span>
                                        </button>

                                        <button
                                            onClick={() => setCustomerData({ ...customerData, isDelivery: false })}
                                            className={`relative flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${customerData.isDelivery === false
                                                ? 'border-[#8B1538] bg-[#FDF2F4]'
                                                : 'border-[#EBEBEB] bg-white hover:border-[#8B1538]/50'
                                                }`}
                                        >
                                            {customerData.isDelivery === false && (
                                                <div className="absolute top-2 right-2">
                                                    <Check className="h-4 w-4 text-[#8B1538]" />
                                                </div>
                                            )}
                                            <Store className={`h-6 w-6 mb-2 ${customerData.isDelivery === false ? 'text-[#8B1538]' : 'text-[#717171]'}`} />
                                            <span className={`font-medium text-sm ${customerData.isDelivery === false ? 'text-[#8B1538]' : 'text-[#1A1A1A]'}`}>Store Pickup</span>
                                            <span className="text-xs text-[#717171] mt-0.5">Visit our store</span>
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {customerData.isDelivery !== null && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-4"
                                            >
                                                {/* Name Field */}
                                                <div>
                                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={customerData.name}
                                                        onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                                                        className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.name
                                                            ? 'border-red-400 focus:ring-red-200 bg-red-50'
                                                            : 'border-[#EBEBEB] focus:ring-[#8B1538]/20 focus:border-[#8B1538]'
                                                            }`}
                                                        placeholder="Enter your full name"
                                                    />
                                                    {errors.name && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                                    )}
                                                </div>

                                                {/* Phone Field */}
                                                <div>
                                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={customerData.phone}
                                                        onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                                        className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.phone
                                                            ? 'border-red-400 focus:ring-red-200 bg-red-50'
                                                            : 'border-[#EBEBEB] focus:ring-[#8B1538]/20 focus:border-[#8B1538]'
                                                            }`}
                                                        placeholder="10-digit phone number"
                                                        maxLength={10}
                                                    />
                                                    {errors.phone && (
                                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                                    )}
                                                </div>

                                                {/* Address Field - Only show for delivery */}
                                                {customerData.isDelivery && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                    >
                                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                                                            Delivery Address
                                                        </label>
                                                        <textarea
                                                            value={customerData.address}
                                                            onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                                                            className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all resize-none ${errors.address
                                                                ? 'border-red-400 focus:ring-red-200 bg-red-50'
                                                                : 'border-[#EBEBEB] focus:ring-[#8B1538]/20 focus:border-[#8B1538]'
                                                                }`}
                                                            placeholder="Enter your complete delivery address"
                                                            rows={3}
                                                        />
                                                        {errors.address && (
                                                            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                                                        )}
                                                    </motion.div>
                                                )}

                                                {/* Error Message */}
                                                {submitError && (
                                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                        <p className="text-red-600 text-sm">{submitError}</p>
                                                    </div>
                                                )}

                                                <div className="flex gap-3 pt-2">
                                                    <button
                                                        onClick={handleBackToCart}
                                                        disabled={isSubmitting}
                                                        className="flex-1 py-3 border border-[#EBEBEB] text-[#4A4A4A] font-medium rounded-lg hover:bg-[#F8F8F8] transition-colors disabled:opacity-50"
                                                    >
                                                        Back
                                                    </button>
                                                    <button
                                                        onClick={handleCheckout}
                                                        disabled={isSubmitting}
                                                        className="flex-1 py-3 bg-[#8B1538] text-white font-medium rounded-lg hover:bg-[#6B102B] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                                    >
                                                        {isSubmitting ? (
                                                            <>
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                Processing...
                                                            </>
                                                        ) : (
                                                            'Place Order'
                                                        )}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {customerData.isDelivery === null && (
                                        <button
                                            onClick={handleBackToCart}
                                            className="w-full py-3 border border-[#EBEBEB] text-[#4A4A4A] font-medium rounded-lg hover:bg-[#F8F8F8] transition-colors"
                                        >
                                            Back to Bag
                                        </button>
                                    )}
                                </div>
                            ) : items.length === 0 ? (
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
                                        className="px-6 py-2.5 bg-[#8B1538] text-white font-medium rounded-lg hover:bg-[#6B102B] transition-colors"
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
                                                            className="p-1.5 hover:bg-[#F8F8F8] transition-colors text-[#717171] hover:text-[#8B1538] rounded-l-lg"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-medium text-[#1A1A1A]">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariation?.id)}
                                                            className="p-1.5 hover:bg-[#F8F8F8] transition-colors text-[#717171] hover:text-[#8B1538] rounded-r-lg"
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
                        {!isOrderPlaced && !showCustomerForm && items.length > 0 && (
                            <div className="p-4 border-t border-[#EBEBEB] bg-white space-y-4">
                                {/* Coupon Section */}
                                {!appliedCoupon ? (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    placeholder="Enter coupon code"
                                                    className="w-full px-4 py-2.5 bg-[#F8F8F8] border border-[#EBEBEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1538]/20 focus:border-[#8B1538] transition-all"
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
                                            onClick={removeCoupon}
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
                                </div>

                                <button
                                    onClick={handleProceedToCheckout}
                                    className="w-full py-3.5 bg-[#8B1538] text-white font-semibold rounded-lg hover:bg-[#6B102B] transition-colors flex items-center justify-center gap-2"
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
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
