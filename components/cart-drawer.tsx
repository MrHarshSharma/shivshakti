
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/context/cart-context'
import { useState, useEffect } from 'react'
import { sendOrderConfirmationEmail } from '@/utils/emailjs'
import { loadRazorpayScript, type RazorpayResponse } from '@/utils/razorpay'

export default function CartDrawer() {
    const { isCartOpen, toggleCart, items, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
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

    // Load customer data from localStorage on mount
    useEffect(() => {
        const savedCustomerData = localStorage.getItem('shivshakti_customer_data')
        if (savedCustomerData) {
            try {
                const parsedData = JSON.parse(savedCustomerData)
                setCustomerData(parsedData)
            } catch (error) {
                console.error('Error loading customer data:', error)
            }
        }
    }, [])

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
        setShowCustomerForm(true)
    }

    const handleBackToCart = () => {
        setShowCustomerForm(false)
        setErrors({ name: '', phone: '', address: '' })
        setSubmitError('')
    }

    const handleCheckout = async () => {
        if (!validateForm()) return

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
                    amount: cartTotal,
                    currency: 'INR',
                    customerName: customerData.name,
                    customerPhone: customerData.phone,
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
                                items: items,
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
                                total: cartTotal,
                                shipping: 0,
                                tax: 0
                            }
                        }).catch(err => console.error('Email sending failed:', err))

                        // Save customer data to localStorage
                        localStorage.setItem('shivshakti_customer_data', JSON.stringify(customerData))

                        // Dispatch custom event to notify navbar
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
            const razorpay = new window.Razorpay(options)
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
                            <div className="p-6 border-t border-orange-100 bg-white">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-playfair text-lg text-[#4A3737]">Subtotal</span>
                                    <span className="font-cinzel text-2xl font-bold text-[#2D1B1B]">₹{cartTotal}</span>
                                </div>
                                <button
                                    onClick={handleProceedToCheckout}
                                    className="w-full py-4 bg-[#2D1B1B] text-white font-bold uppercase tracking-widest hover:bg-saffron transition-colors shadow-lg rounded-sm"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
