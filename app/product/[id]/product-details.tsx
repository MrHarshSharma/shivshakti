'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ShoppingBag, Minus, Plus, Check, ChevronRight, Truck, Shield, Gift, MessageCircle, X } from 'lucide-react'
import { useCart } from '@/context/cart-context'
import { Product } from '@/data/products'

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0
    })
}

interface ProductDetailsProps {
    product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
    const { addToCartSilent, items, updateQuantity } = useCart()
    const [quantity, setQuantity] = useState(1)

    // Initialize selected variation immediately (not in useEffect) to avoid hydration mismatch
    const getInitialVariation = () => {
        if (product?.product_type === 'variable' && product.variations && product.variations.length > 0) {
            return product.variations.find(v => v.is_default) || product.variations[0]
        }
        return null
    }

    const [selectedVariation, setSelectedVariation] = useState<any>(getInitialVariation)
    const [showSuccess, setShowSuccess] = useState(false)
    const [[page, direction], setPage] = useState([0, 0])
    const [showBulkModal, setShowBulkModal] = useState(false)
    const [bulkQuantity, setBulkQuantity] = useState(10)
    const [bulkSize, setBulkSize] = useState('')

    const id = product.id.toString()

    const paginate = (newDirection: number) => {
        if (!product?.images) return
        const newPage = (page + newDirection + product.images.length) % product.images.length
        setPage([newPage, newDirection])
    }

    // Sync quantity with cart when cart changes
    useEffect(() => {
        if (id && product) {
            const cartItem = items.find(item =>
                item.id.toString() === id.toString() &&
                (!selectedVariation || item.selectedVariation?.id === selectedVariation.id)
            )
            if (cartItem) {
                setQuantity(cartItem.quantity)
            } else {
                setQuantity(1)
            }
        }
    }, [id, items, product, selectedVariation])

    const cartItem = items.find(item =>
        item.id.toString() === id.toString() &&
        (!selectedVariation || item.selectedVariation?.id === selectedVariation.id)
    )
    const isInCart = !!cartItem

    const handleAddToCart = () => {
        if (!product) return
        if (isInCart) {
            updateQuantity(product.id, quantity, selectedVariation?.id)
        } else {
            addToCartSilent(product, quantity, selectedVariation)
        }
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
    }

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity)
    }

    const handleBulkOrder = () => {
        const productName = product.name
        const size = bulkSize || 'Size not selected'
        const quantity = bulkQuantity
        const message = `Hello, we would like to order ${quantity} pairs of ${productName} in ${size}. Please let us know the availability.`
        const whatsappNumber = '919665654326' // +91 9665654326
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
        setShowBulkModal(false)
    }

    const handleEnquire = () => {
        const productName = product.name
        const message = `Hello, I would like to enquire about the availability of ${productName}. When will it be back in stock?`
        const whatsappNumber = '919665654326' // +91 9665654326
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    const isOutOfStock = product.in_stock === false

    const imageIndex = product.images && product.images.length > 0 ? page % product.images.length : 0

    // Parse description
    let description = product.description
    let details = ''
    let care = ''
    let isJson = false

    try {
        const jsonDesc = JSON.parse(product.description)
        if (typeof jsonDesc === 'object' && jsonDesc !== null) {
            description = jsonDesc.productDescription || ''
            details = jsonDesc.productDetails || ''
            care = jsonDesc.careInstructions || ''
            isJson = true
        }
    } catch (e) {
        // Not a JSON string
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="bg-[#F8F8F8] border-b border-[#EBEBEB]">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/products" className="text-[#717171] hover:text-[#000000] transition-colors">
                            Shop
                        </Link>
                        <ChevronRight className="w-4 h-4 text-[#EBEBEB]" />
                        {product.categories && product.categories.length > 0 && (
                            <>
                                <span className="text-[#717171]">{product.categories[0]}</span>
                                <ChevronRight className="w-4 h-4 text-[#EBEBEB]" />
                            </>
                        )}
                        <span className="text-[#1A1A1A] font-medium truncate max-w-[200px]">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 md:py-12">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Image Section */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-[#F8F8F8] rounded-xl overflow-hidden group">
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
                                        className={`object-cover ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Arrows */}
                            {product.images && product.images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => paginate(-1)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md text-[#4A4A4A] hover:text-[#000000] transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => paginate(1)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md text-[#4A4A4A] hover:text-[#000000] transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}

                            {/* Badges */}
                            {isOutOfStock ? (
                                <span className="absolute top-4 left-4 px-3 py-1.5 bg-[#4A4A4A] text-white text-xs font-semibold rounded-md z-10">
                                    OUT OF STOCK
                                </span>
                            ) : product.isNew ? (
                                <span className="absolute top-4 left-4 px-3 py-1.5 bg-[#000000] text-white text-xs font-semibold rounded-md z-10">
                                    NEW
                                </span>
                            ) : null}

                            {/* Image Counter */}
                            {product.images && product.images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 bg-black/50 rounded-full text-white text-xs font-medium">
                                    {imageIndex + 1} / {product.images.length}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setPage([idx, idx > imageIndex ? 1 : -1])}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all border-2 ${imageIndex === idx
                                            ? 'border-[#000000] ring-2 ring-[#000000]/20'
                                            : 'border-[#EBEBEB] hover:border-[#000000]/50'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} thumbnail ${idx + 1}`}
                                            fill
                                            className={`object-cover ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="lg:py-4">
                        {/* Categories */}
                        {product.categories && product.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {product.categories.map((category, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs font-medium text-[#000000] uppercase tracking-wide"
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Product Name */}
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4 leading-tight">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                                ${(selectedVariation?.price ?? product.price ?? 0).toLocaleString()}
                            </span>
                            {selectedVariation && (
                                <span className="text-sm text-[#717171]">
                                    ({selectedVariation.name})
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <p className="text-[#4A4A4A] leading-relaxed">{description}</p>
                        </div>

                        {/* Variation Selector */}
                        {product.product_type === 'variable' && product.variations && product.variations.length > 0 && !isOutOfStock && (
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Select Option</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.variations.map((variation) => (
                                        <button
                                            key={variation.id}
                                            onClick={() => setSelectedVariation(variation)}
                                            className={`px-4 py-3 rounded-lg border transition-all text-sm ${selectedVariation?.id === variation.id
                                                ? 'border-[#000000] bg-[#E5E5E5] text-[#000000]'
                                                : 'border-[#EBEBEB] bg-white text-[#4A4A4A] hover:border-[#000000]/50'
                                                }`}
                                        >
                                            <div className="font-medium">{variation.name}</div>
                                            <div className="text-xs opacity-70 mt-0.5">${variation.price.toLocaleString()}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Add to Cart / Enquire Button */}
                        {isOutOfStock ? (
                            <div className="mb-4">
                                <button
                                    onClick={handleEnquire}
                                    className="w-full px-6 py-3.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-[#4A4A4A] text-white hover:bg-[#333333]"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    Enquire Now
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 mb-4">
                                {/* Quantity Selector */}
                                <div className="flex items-center border border-[#EBEBEB] rounded-lg flex-shrink-0">
                                    <button
                                        onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                                        className="p-3 hover:bg-[#F8F8F8] transition-colors text-[#4A4A4A] hover:text-[#000000]"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-10 text-center font-semibold text-[#1A1A1A]">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="p-3 hover:bg-[#F8F8F8] transition-colors text-[#4A4A4A] hover:text-[#000000]"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 px-6 py-3.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${showSuccess
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-[#000000] text-white hover:bg-[#000000]'
                                        }`}
                                >
                                    {showSuccess ? (
                                        <>
                                            <Check className="h-5 w-5" />
                                            Added to Bag
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag className="h-5 w-5" />
                                            {isInCart ? 'Update Bag' : 'Add to Bag'}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Bulk Order Button - Only show if in stock */}
                        {!isOutOfStock && (
                            <button
                                onClick={() => {
                                    // Set default size when opening modal
                                    if (product.product_type === 'variable' && product.variations && product.variations.length > 0) {
                                        const defaultVar = product.variations.find(v => v.is_default) || product.variations[0]
                                        setBulkSize(defaultVar.name)
                                    } else {
                                        setBulkSize('9')
                                    }
                                    setShowBulkModal(true)
                                }}
                                className="w-full px-6 py-3.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-white border-2 border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-white mb-8"
                            >
                                <MessageCircle className="h-5 w-5" />
                                Bulk Order via WhatsApp
                            </button>
                        )}

                        {/* Out of Stock Badge */}
                        {isOutOfStock && (
                            <div className="mb-8 p-4 bg-[#F8F8F8] border border-[#EBEBEB] rounded-lg">
                                <p className="text-sm text-[#4A4A4A] text-center">
                                    <span className="font-semibold text-[#1A1A1A]">Out of Stock</span> - Click "Enquire Now" to get notified when available
                                </p>
                            </div>
                        )}

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-[#F8F8F8] rounded-xl mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#000000]">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#1A1A1A]">Free Delivery</p>
                                    <p className="text-xs text-[#717171]">On orders above $999</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#000000]">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#1A1A1A]">Secure Payment</p>
                                    <p className="text-xs text-[#717171]">100% protected</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#000000]">
                                    <Gift className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#1A1A1A]">Easy Returns</p>
                                    <p className="text-xs text-[#717171]">7-day return policy</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#000000]">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#1A1A1A]">100% Authentic</p>
                                    <p className="text-xs text-[#717171]">Genuine products only</p>
                                </div>
                            </div>
                        </div>

                        {/* Product Details & Care */}
                        {(details || care) && (
                            <div className="border-t border-[#EBEBEB] pt-8 space-y-6">
                                {details && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Product Details</h3>
                                        <p className="text-[#4A4A4A] text-sm leading-relaxed whitespace-pre-line">{details}</p>
                                    </div>
                                )}
                                {care && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-[#1A1A1A] mb-3">Care Instructions</h3>
                                        <p className="text-[#4A4A4A] text-sm leading-relaxed whitespace-pre-line">{care}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bulk Order Modal */}
            <AnimatePresence>
                {showBulkModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowBulkModal(false)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Bulk Order</h2>
                                    <button
                                        onClick={() => setShowBulkModal(false)}
                                        className="p-2 hover:bg-[#F8F8F8] rounded-lg transition-colors"
                                    >
                                        <X className="h-5 w-5 text-[#4A4A4A]" />
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="mb-6 p-4 bg-[#F8F8F8] rounded-xl">
                                    <p className="text-sm text-[#717171] mb-1">Product</p>
                                    <p className="font-semibold text-[#1A1A1A]">{product.name}</p>
                                </div>

                                {/* Size Dropdown */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                        Size *
                                    </label>
                                    <select
                                        value={bulkSize}
                                        onChange={(e) => setBulkSize(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#EBEBEB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent"
                                    >
                                        <option value="">Select size</option>
                                        {product.product_type === 'variable' && product.variations ? (
                                            product.variations.map((variation) => (
                                                <option key={variation.id} value={variation.name}>
                                                    {variation.name}
                                                </option>
                                            ))
                                        ) : (
                                            <>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                                <option value="11">11</option>
                                            </>
                                        )}
                                    </select>
                                </div>

                                {/* Quantity Input */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                        Quantity *
                                    </label>
                                    <div className="flex items-center border border-[#EBEBEB] rounded-lg">
                                        <button
                                            onClick={() => setBulkQuantity(Math.max(1, bulkQuantity - 1))}
                                            className="p-3 hover:bg-[#F8F8F8] transition-colors text-[#4A4A4A] hover:text-[#000000]"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <input
                                            type="number"
                                            value={bulkQuantity}
                                            onChange={(e) => setBulkQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="flex-1 text-center font-semibold text-[#1A1A1A] focus:outline-none"
                                            min="1"
                                        />
                                        <button
                                            onClick={() => setBulkQuantity(bulkQuantity + 1)}
                                            className="p-3 hover:bg-[#F8F8F8] transition-colors text-[#4A4A4A] hover:text-[#000000]"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleBulkOrder}
                                    disabled={!bulkSize}
                                    className="w-full px-6 py-3.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#20BA5A] disabled:bg-[#EBEBEB] disabled:text-[#717171] disabled:cursor-not-allowed"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    Send via WhatsApp
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
