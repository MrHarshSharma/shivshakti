'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    ShoppingBag, Check, Truck, Store, Loader2, Ticket, ArrowLeft, Lock,
} from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import { sendOrderReceivedEmail } from '@/utils/emailjs'
import { loadRazorpayScript, type RazorpayResponse } from '@/utils/razorpay'
import AddressAutocomplete, { type SelectedPlace } from '@/components/address-autocomplete'
import DeliveryZoneNotice from '@/components/delivery-zone-notice'
import { assessDelivery, FREE_DELIVERY_RADIUS_KM } from '@/utils/delivery'

export default function CheckoutClient() {
    const {
        items, cartTotal, clearCart,
        appliedCoupon, setAppliedCoupon, discountAmount, finalTotal,
    } = useCart()
    const { user, loginWithGoogle } = useAuth()
    const router = useRouter()

    const [isOrderPlaced, setIsOrderPlaced] = useState(false)
    const [placedOrderId, setPlacedOrderId] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const [customerData, setCustomerData] = useState({
        name: '',
        phone: '',
        address: '',
        // Flat / house number / landmark. Kept separate from the geocoded place
        // because Places gives us a locality, never a doorstep.
        addressLine: '',
        place: null as SelectedPlace | null,
        isDelivery: null as boolean | null,
    })
    const [errors, setErrors] = useState({
        name: '', phone: '', address: '', addressLine: '', acknowledgement: '',
    })

    const [placesUnavailable, setPlacesUnavailable] = useState(false)
    const [placesChecked, setPlacesChecked] = useState(false)
    const [feeAcknowledged, setFeeAcknowledged] = useState(false)

    const [couponCode, setCouponCode] = useState('')
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
    const [couponError, setCouponError] = useState('')

    const isDeliveryOrder = customerData.isDelivery === true
    const delivery = useMemo(() => assessDelivery(customerData.place), [customerData.place])

    const hasDeliveryAddress = placesUnavailable
        ? customerData.address.trim().length > 0
        : !!customerData.place

    const needsFeeAcknowledgement = isDeliveryOrder && hasDeliveryAddress && !delivery.isFree

    // Resolve address-search availability once, up front, so the field never swaps
    // out from under the customer mid-typing.
    useEffect(() => {
        let cancelled = false
        fetch('/api/places/autocomplete')
            .then(res => res.json())
            .then(data => { if (!cancelled) setPlacesUnavailable(!data.available) })
            .catch(() => { if (!cancelled) setPlacesUnavailable(true) })
            .finally(() => { if (!cancelled) setPlacesChecked(true) })
        return () => { cancelled = true }
    }, [])

    // Prefill from whatever the customer used last time.
    useEffect(() => {
        const normalize = (stored: unknown) => {
            const source = (stored && typeof stored === 'object' ? stored : {}) as Record<string, unknown>
            const place = source.place as SelectedPlace | undefined
            return {
                name: typeof source.name === 'string' ? source.name : '',
                phone: typeof source.phone === 'string' ? source.phone : '',
                address: typeof source.address === 'string' ? source.address : '',
                addressLine: typeof source.addressLine === 'string' ? source.addressLine : '',
                place: place && typeof place.lat === 'number' ? place : null,
                isDelivery: typeof source.isDelivery === 'boolean' ? source.isDelivery : null,
            }
        }

        if (user) {
            const saved = localStorage.getItem(`shivshakti_customer_${user.email}`)
            if (saved) {
                try {
                    const parsed = normalize(JSON.parse(saved))
                    setCustomerData({
                        ...parsed,
                        name: user.user_metadata.full_name || parsed.name || '',
                    })
                    return
                } catch (e) { console.error(e) }
            }
            setCustomerData(prev => ({ ...prev, name: user.user_metadata.full_name || '' }))
        } else {
            const global = localStorage.getItem('shivshakti_customer_data')
            if (global) {
                try { setCustomerData(normalize(JSON.parse(global))) } catch (e) { console.error(e) }
            }
        }
    }, [user])

    const validateForm = () => {
        const next = { name: '', phone: '', address: '', addressLine: '', acknowledgement: '' }
        let valid = true

        if (!customerData.name.trim()) { next.name = 'Name is required'; valid = false }

        if (!customerData.phone.trim()) {
            next.phone = 'Phone number is required'; valid = false
        } else if (!/^\d{10}$/.test(customerData.phone)) {
            next.phone = 'Phone number must be exactly 10 digits'; valid = false
        }

        if (customerData.isDelivery === null) {
            next.address = 'Please choose delivery or store pickup'
            valid = false
        } else if (isDeliveryOrder) {
            if (placesUnavailable) {
                if (!customerData.address.trim()) { next.address = 'Address is required'; valid = false }
            } else {
                if (!customerData.place) { next.address = 'Please search for and select your area'; valid = false }
                if (!customerData.addressLine.trim()) { next.addressLine = 'Flat / house number is required'; valid = false }
            }
            if (needsFeeAcknowledgement && !feeAcknowledged) {
                next.acknowledgement = 'Please confirm you understand the delivery charges'
                valid = false
            }
        }

        setErrors(next)
        return valid
    }

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

    const handleSwitchToPickup = () => {
        setCustomerData(prev => ({ ...prev, isDelivery: false }))
        setFeeAcknowledged(false)
        setErrors(prev => ({ ...prev, address: '', addressLine: '', acknowledgement: '' }))
    }

    const handlePay = async () => {
        if (!validateForm()) return
        if (!user) { setSubmitError('Please sign in to place an order'); return }

        setIsSubmitting(true)
        setSubmitError('')

        const isPickup = customerData.isDelivery === false
        const composedAddress = placesUnavailable
            ? customerData.address
            : [customerData.addressLine.trim(), customerData.place?.formattedAddress]
                .filter(Boolean).join(', ')
        const orderAddress = isPickup ? 'Store Pickup' : composedAddress

        try {
            const scriptLoaded = await loadRazorpayScript()
            if (!scriptLoaded) throw new Error('Failed to load Razorpay. Please try again.')

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
            if (!orderResponse.ok) throw new Error(orderData.error || 'Failed to create payment order')

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Shivshakti',
                description: isPickup ? 'Store Pickup Order' : 'Order Payment',
                order_id: orderData.orderId,
                prefill: {
                    name: customerData.name,
                    contact: customerData.phone,
                    email: user.email,
                },
                theme: { color: '#D29B6C' },
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
                                address: orderAddress,
                                email: user.email,
                                user_id: user.id,
                                items,
                                discount: discountAmount,
                                coupon_code: appliedCoupon?.code || null,
                                total: finalTotal,
                                is_delivery: !isPickup,
                                // The server re-resolves this place ID with Google and
                                // derives the zone itself.
                                delivery_place_id: isPickup ? null : customerData.place?.placeId || null,
                                delivery_fee_acknowledged: needsFeeAcknowledgement ? feeAcknowledged : null,
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
                                image: (item.images && item.images.length > 0) ? item.images[0] : (item as any).image || '/placeholder-product.png',
                            })),
                            cost: { total: finalTotal, subtotal: cartTotal, discount: discountAmount, shipping: 0, tax: 0 },
                            reply_to: user.email,
                            mode: isPickup
                                ? 'Store Pickup'
                                : delivery.isFree
                                    ? `Doorstep Delivery (free — within ${FREE_DELIVERY_RADIUS_KM} km)`
                                    : 'Doorstep Delivery — DELIVERY FEE PENDING, call customer to confirm',
                            phone: customerData.phone,
                            email: user.email,
                            address: orderAddress,
                        }).catch(err => console.error('Email sending failed:', err))

                        localStorage.setItem('shivshakti_customer_data', JSON.stringify(customerData))
                        localStorage.setItem(`shivshakti_customer_${user.email}`, JSON.stringify(customerData))
                        window.dispatchEvent(new Event('customerDataUpdated'))

                        setPlacedOrderId(createOrderData.orderId)
                        setIsOrderPlaced(true)
                        setIsSubmitting(false)
                        clearCart()
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
                    },
                },
            }

            const razorpay = new (window as any).Razorpay(options)
            razorpay.open()
        } catch (error) {
            console.error('Payment initialization error:', error)
            setSubmitError(error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.')
            setIsSubmitting(false)
        }
    }

    const inputClass = (hasError: boolean) =>
        `w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${hasError
            ? 'border-red-400 focus:ring-red-200 bg-red-50'
            : 'border-[#EBEBEB] focus:ring-[#D29B6C]/20 focus:border-[#D29B6C]'}`

    // ---- Confirmation ------------------------------------------------------
    if (isOrderPlaced) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <Check className="h-10 w-10 text-emerald-600" />
                    </motion.div>
                    <h1 className="text-2xl font-playfair font-semibold text-[#1A1A1A] mb-2">Order Placed!</h1>
                    <p className="text-[#717171] mb-1">Thank you for shopping with Shivshakti.</p>
                    {placedOrderId && (
                        <p className="text-sm text-[#717171] mb-8">
                            Your order number is <span className="font-semibold text-[#1A1A1A]">#{placedOrderId}</span>.
                            We&apos;ve emailed you the details.
                        </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/my-orders" className="px-6 py-3 bg-[#D29B6C] text-white font-medium rounded-lg hover:bg-[#B8845A] transition-colors">
                            View My Orders
                        </Link>
                        <Link href="/products" className="px-6 py-3 bg-white text-[#1A1A1A] font-medium rounded-lg border border-[#EBEBEB] hover:border-[#1A1A1A] transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                </motion.div>
            </div>
        )
    }

    // ---- Empty cart --------------------------------------------------------
    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
                <div className="text-center">
                    <div className="w-20 h-20 bg-[#F8F8F8] rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="h-8 w-8 text-[#717171]" />
                    </div>
                    <h1 className="text-2xl font-playfair font-semibold text-[#1A1A1A] mb-2">Your bag is empty</h1>
                    <p className="text-[#717171] mb-8">Add something you love before checking out.</p>
                    <Link href="/products" className="inline-block px-6 py-3 bg-[#D29B6C] text-white font-medium rounded-lg hover:bg-[#B8845A] transition-colors">
                        Browse Products
                    </Link>
                </div>
            </div>
        )
    }

    // ---- Not signed in -----------------------------------------------------
    if (!user) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-[#EBDDC4] rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="h-7 w-7 text-[#D29B6C]" />
                    </div>
                    <h1 className="text-2xl font-playfair font-semibold text-[#1A1A1A] mb-2">Sign in to checkout</h1>
                    <p className="text-[#717171] mb-8">
                        We&apos;ll use your account to send order updates and keep track of your purchases.
                    </p>
                    <button
                        onClick={() => loginWithGoogle('/checkout')}
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

    // ---- Checkout ----------------------------------------------------------
    return (
        <div className="bg-[#FDFBF8] min-h-screen">
            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 max-w-6xl">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm text-[#717171] hover:text-[#1A1A1A] transition-colors mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <h1 className="text-2xl lg:text-3xl font-playfair font-semibold text-[#1A1A1A] mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
                    {/* ---------------- Left: details ---------------- */}
                    <div className="space-y-6">
                        {/* Fulfilment */}
                        <section className="bg-white border border-[#EBEBEB] rounded-xl p-6">
                            <h2 className="font-semibold text-[#1A1A1A] mb-1">How would you like to receive your order?</h2>
                            <p className="text-sm text-[#717171] mb-4">Choose one to continue.</p>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setCustomerData({ ...customerData, isDelivery: true })}
                                    className={`relative flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${customerData.isDelivery === true
                                        ? 'border-[#D29B6C] bg-[#EBDDC4]'
                                        : 'border-[#EBEBEB] bg-white hover:border-[#D29B6C]/50'}`}
                                >
                                    {customerData.isDelivery === true && (
                                        <div className="absolute top-2 right-2"><Check className="h-4 w-4 text-[#D29B6C]" /></div>
                                    )}
                                    <Truck className={`h-6 w-6 mb-2 ${customerData.isDelivery === true ? 'text-[#D29B6C]' : 'text-[#717171]'}`} />
                                    <span className={`font-medium text-sm ${customerData.isDelivery === true ? 'text-[#D29B6C]' : 'text-[#1A1A1A]'}`}>Delivery</span>
                                    <span className="text-xs text-[#717171] mt-0.5">To your doorstep</span>
                                    <span className="text-[10px] font-medium text-emerald-600 mt-1">
                                        Free within {FREE_DELIVERY_RADIUS_KM} km
                                    </span>
                                </button>

                                <button
                                    onClick={handleSwitchToPickup}
                                    className={`relative flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${customerData.isDelivery === false
                                        ? 'border-[#D29B6C] bg-[#EBDDC4]'
                                        : 'border-[#EBEBEB] bg-white hover:border-[#D29B6C]/50'}`}
                                >
                                    {customerData.isDelivery === false && (
                                        <div className="absolute top-2 right-2"><Check className="h-4 w-4 text-[#D29B6C]" /></div>
                                    )}
                                    <Store className={`h-6 w-6 mb-2 ${customerData.isDelivery === false ? 'text-[#D29B6C]' : 'text-[#717171]'}`} />
                                    <span className={`font-medium text-sm ${customerData.isDelivery === false ? 'text-[#D29B6C]' : 'text-[#1A1A1A]'}`}>Store Pickup</span>
                                    <span className="text-xs text-[#717171] mt-0.5">Visit our store</span>
                                    <span className="text-[10px] font-medium text-emerald-600 mt-1">Always free</span>
                                </button>
                            </div>
                        </section>

                        {/* Contact */}
                        <section className="bg-white border border-[#EBEBEB] rounded-xl p-6 space-y-4">
                            <h2 className="font-semibold text-[#1A1A1A]">Contact details</h2>

                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={customerData.name}
                                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                                    className={inputClass(!!errors.name)}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Phone Number</label>
                                <input
                                    type="tel"
                                    value={customerData.phone}
                                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                    className={inputClass(!!errors.phone)}
                                    placeholder="10-digit phone number"
                                    maxLength={10}
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={user.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 border border-[#EBEBEB] rounded-lg text-sm bg-[#F8F8F8] text-[#717171]"
                                />
                                <p className="text-xs text-[#717171] mt-1">Order updates go to your account email.</p>
                            </div>
                        </section>

                        {/* Address */}
                        {isDeliveryOrder && (
                            <section className="bg-white border border-[#EBEBEB] rounded-xl p-6 space-y-4">
                                <h2 className="font-semibold text-[#1A1A1A]">Delivery address</h2>

                                <div>
                                    {!placesChecked ? (
                                        <div className="w-full px-4 py-3 border border-[#EBEBEB] rounded-lg bg-[#F8F8F8] text-sm text-[#717171] flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading address search…
                                        </div>
                                    ) : placesUnavailable ? (
                                        <textarea
                                            value={customerData.address}
                                            onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                                            className={`${inputClass(!!errors.address)} resize-none`}
                                            placeholder="Enter your complete delivery address"
                                            rows={3}
                                        />
                                    ) : (
                                        <AddressAutocomplete
                                            value={customerData.place}
                                            onSelect={(place) => {
                                                setCustomerData(prev => ({ ...prev, place }))
                                                setFeeAcknowledged(false)
                                                setErrors(prev => ({ ...prev, address: '', acknowledgement: '' }))
                                            }}
                                            onClear={() => {
                                                setCustomerData(prev => ({ ...prev, place: null }))
                                                setFeeAcknowledged(false)
                                            }}
                                            onUnavailable={(typed) => {
                                                setPlacesUnavailable(true)
                                                setCustomerData(prev => ({ ...prev, address: prev.address || typed }))
                                            }}
                                            hasError={!!errors.address}
                                        />
                                    )}
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                </div>

                                {!placesUnavailable && customerData.place && (
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                                            Flat / House No. &amp; Landmark
                                        </label>
                                        <input
                                            type="text"
                                            value={customerData.addressLine}
                                            onChange={(e) => setCustomerData({ ...customerData, addressLine: e.target.value })}
                                            className={inputClass(!!errors.addressLine)}
                                            placeholder="e.g. Flat 302, Wanjari Complex, near Kamal Chowk"
                                        />
                                        {errors.addressLine && <p className="text-red-500 text-xs mt-1">{errors.addressLine}</p>}
                                    </div>
                                )}

                                {hasDeliveryAddress && (
                                    <div className="space-y-1">
                                        <DeliveryZoneNotice
                                            zone={placesUnavailable ? 'unknown' : delivery.zone}
                                            distanceKm={delivery.distanceKm}
                                            acknowledged={feeAcknowledged}
                                            onAcknowledge={(checked) => {
                                                setFeeAcknowledged(checked)
                                                if (checked) setErrors(prev => ({ ...prev, acknowledgement: '' }))
                                            }}
                                            onSwitchToPickup={handleSwitchToPickup}
                                        />
                                        {errors.acknowledgement && (
                                            <p className="text-red-500 text-xs">{errors.acknowledgement}</p>
                                        )}
                                    </div>
                                )}
                            </section>
                        )}

                        {customerData.isDelivery === false && (
                            <section className="bg-white border border-[#EBEBEB] rounded-xl p-6">
                                <h2 className="font-semibold text-[#1A1A1A] mb-2">Pickup location</h2>
                                <p className="text-sm text-[#4A4A4A] leading-relaxed">
                                    362, Wanjari Complex, Dr Ambedkar Rd, Kamal Chowk,<br />
                                    Gurunanakpura, Balabhaupeth, Nagpur, Maharashtra 440017
                                </p>
                                <p className="text-xs text-[#717171] mt-2">
                                    We&apos;ll call you once your order is ready to collect.
                                </p>
                            </section>
                        )}
                    </div>

                    {/* ---------------- Right: summary ---------------- */}
                    <aside className="bg-white border border-[#EBEBEB] rounded-xl p-6 lg:sticky lg:top-24 space-y-5">
                        <h2 className="font-semibold text-[#1A1A1A]">Order summary</h2>

                        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                            {items.map(item => (
                                <div key={`${item.id}-${item.selectedVariation?.id || 'default'}`} className="flex gap-3">
                                    <div className="relative h-14 w-14 bg-[#F8F8F8] rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={(item.images && item.images.length > 0) ? item.images[0] : (item as any).image || '/placeholder-product.png'}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#D29B6C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-[#1A1A1A] line-clamp-1">{item.name}</p>
                                        {item.selectedVariation && (
                                            <p className="text-xs text-[#717171]">{item.selectedVariation.name}</p>
                                        )}
                                    </div>
                                    <p className="text-sm font-semibold text-[#1A1A1A] whitespace-nowrap">
                                        ₹{((item.selectedVariation ? item.selectedVariation.price : item.price) * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Coupon */}
                        <div className="pt-4 border-t border-[#EBEBEB]">
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
                        </div>

                        {/* Totals */}
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
                            {customerData.isDelivery !== null && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#717171]">Delivery</span>
                                    {customerData.isDelivery === false ? (
                                        <span className="font-medium text-emerald-600">FREE (pickup)</span>
                                    ) : !hasDeliveryAddress ? (
                                        <span className="text-[#717171]">Enter address</span>
                                    ) : delivery.isFree ? (
                                        <span className="font-medium text-emerald-600">FREE</span>
                                    ) : (
                                        <span className="font-medium text-amber-700">To be confirmed</span>
                                    )}
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-3 border-t border-[#EBEBEB]">
                                <span className="font-medium text-[#1A1A1A]">Paying now</span>
                                <span className="text-xl font-bold text-[#1A1A1A]">₹{finalTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        {submitError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-red-600 text-sm">{submitError}</p>
                            </div>
                        )}

                        <button
                            onClick={handlePay}
                            disabled={isSubmitting}
                            className="w-full py-3.5 bg-[#D29B6C] text-white font-semibold rounded-lg hover:bg-[#B8845A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                            ) : (
                                <>
                                    <Lock className="h-4 w-4" />
                                    {`Pay ₹${finalTotal.toLocaleString()}${needsFeeAcknowledgement ? ' + delivery' : ''}`}
                                </>
                            )}
                        </button>

                        <p className="text-xs text-[#717171] text-center">
                            Secured by Razorpay. Your card details never touch our servers.
                        </p>
                    </aside>
                </div>
            </div>
        </div>
    )
}
