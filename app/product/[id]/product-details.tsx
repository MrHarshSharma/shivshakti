'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Star, Sparkles, Minus, Plus, CheckCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { Product } from '@/data/products'

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
    })
}

interface ProductDetailsProps {
    product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
    const { addToCartSilent, items, updateQuantity } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [showSuccess, setShowSuccess] = useState(false)
    const [[page, direction], setPage] = useState([0, 0])

    const id = product.id.toString()

    // Auto-advance carousel
    useEffect(() => {
        if (!product || !product.images || product.images.length <= 1) return

        const timer = setInterval(() => {
            paginate(1)
        }, 4000)

        return () => clearInterval(timer)
    }, [product, page])

    const paginate = (newDirection: number) => {
        if (!product?.images) return
        const newPage = (page + newDirection + product.images.length) % product.images.length
        setPage([newPage, newDirection])
    }

    // Sync quantity with cart when cart changes
    useEffect(() => {
        if (id && product) {
            const cartItem = items.find(item => item.id.toString() === id.toString())
            if (cartItem) {
                setQuantity(cartItem.quantity)
            } else {
                setQuantity(1)
            }
        }
    }, [id, items, product])

    const cartItem = items.find(item => item.id.toString() === id.toString())
    const isInCart = !!cartItem

    const handleAddToCart = () => {
        if (!product) return
        if (isInCart) {
            // Update quantity if already in cart
            updateQuantity(product.id, quantity)
        } else {
            // Add new item to cart (silently, without opening drawer)
            addToCartSilent(product, quantity)
        }

        // Show success animation
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
    }

    const handleQuantityChange = (newQuantity: number) => {
        // Only update local state, don't update cart until button is clicked
        setQuantity(newQuantity)
    }

    const imageIndex = product.images && product.images.length > 0 ? page % product.images.length : 0

    return (
        <div className="min-h-screen bg-[#FEFBF5] pt-32 pb-20">
            <div className="container mx-auto px-4">
                <Link
                    href="/products"
                    className="inline-flex items-center text-[#4A3737]/60 hover:text-saffron transition-colors mb-12 uppercase tracking-widest text-sm font-bold"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Collection
                </Link>

                <div className="grid md:grid-cols-12 gap-16 lg:gap-24">
                    {/* Image Section */}
                    <div className="md:col-span-5 space-y-6">
                        <div className="relative aspect-[3/4] bg-white rounded-3xl overflow-hidden shadow-2xl border-8 border-white group">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={page}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        const swipe = Math.abs(offset.x) * velocity.x
                                        if (swipe < -10000) {
                                            paginate(1)
                                        } else if (swipe > 10000) {
                                            paginate(-1)
                                        }
                                    }}
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                                >
                                    <Image
                                        src={product.images && product.images.length > 0 ? product.images[imageIndex] : '/placeholder-product.png'}
                                        alt={`${product.name} image ${imageIndex + 1}`}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Arrows */}
                            {product.images && product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => paginate(-1)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-md text-[#2D1B1B] hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={() => paginate(1)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-md text-[#2D1B1B] hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </>
                            )}

                            {product.isNew && (
                                <div className="absolute top-6 right-6 bg-magenta text-white px-4 py-2 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg animate-pulse z-10">
                                    New Arrival
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-3 md:gap-4 overflow-x-auto p-2 scrollbar-hide">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setPage([idx, idx > imageIndex ? 1 : -1])}
                                        className={`relative w-10 h-10 md:w-10 md:h-10 rounded-xl overflow-hidden flex-shrink-0 transition-all border-2 ${imageIndex === idx ? 'border-saffron ring-2 md:ring-4 ring-saffron/20' : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} thumbnail ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="md:col-span-7 flex flex-col justify-center">
                        <div className="flex flex-wrap gap-2 mb-6">
                            <Sparkles className="h-5 w-5 text-saffron self-center" />
                            {product.categories && product.categories.length > 0 ? (
                                product.categories.map((category, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-orange-50 text-saffron px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-orange-100"
                                    >
                                        {category}
                                    </span>
                                ))
                            ) : (
                                <span className="bg-orange-50 text-saffron px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-orange-100">
                                    General
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl md:text-5xl font-cinzel text-[#2D1B1B] mb-4 md:mb-6 leading-tight">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-4 mb-6 md:mb-8">
                            <span className="text-2xl md:text-3xl text-[#4A3737] font-bold">
                                ₹{product.price}
                            </span>
                        </div>

                        <p className="text-[#4A3737]/80 font-playfair text-lg leading-relaxed mb-10 border-l-4 border-magenta/20 pl-6">
                            {product.description}
                        </p>

                        <div className="space-y-8">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4">
                                <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-[#4A3737]">Quantity</span>
                                <div className="flex items-center border border-orange-200 rounded-full bg-white shadow-sm">
                                    <button
                                        onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                                        className="p-2 md:p-3 hover:text-magenta transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-3 w-3 md:h-4 md:w-4" />
                                    </button>
                                    <span className="w-6 md:w-8 text-center text-sm md:text-base font-bold text-[#2D1B1B]">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="p-2 md:p-3 hover:text-saffron transition-colors"
                                    >
                                        <Plus className="h-3 w-3 md:h-4 md:w-4" />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className={`w-full md:w-auto px-8 py-3 md:px-12 md:py-5 text-white text-sm md:text-base font-bold tracking-widest uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-2 md:gap-3 rounded-full ${showSuccess
                                    ? 'bg-emerald-500 hover:bg-emerald-600'
                                    : 'bg-saffron hover:bg-orange-600 hover:shadow-orange-300/50'
                                    }`}
                            >
                                {showSuccess ? (
                                    <>
                                        <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                                        Cart Updated!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                                        {isInCart ? 'Update Cart' : 'Add to Cart'}
                                    </>
                                )}
                            </button>

                            <div className="pt-8 border-t border-orange-100 grid grid-cols-2 gap-8 text-xs text-[#4A3737]/60 uppercase tracking-widest font-bold">
                                <div>
                                    <span className="block text-[#2D1B1B] mb-1 text-sm">Authenticity</span>
                                    Certified Handcrafted
                                </div>
                                <div>
                                    <span className="block text-[#2D1B1B] mb-1 text-sm">Shipping</span>
                                    Global Delivery
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
