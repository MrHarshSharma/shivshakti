
'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import { Product } from '@/data/products'
import { useCart } from '@/context/cart-context'

export default function ProductCard({ product }: { product: Product }) {
    const { items, updateQuantity, removeFromCart } = useCart()
    const cartItem = items.find(item => item.id === product.id)
    const isInCart = !!cartItem

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1) {
            // Remove from cart if quantity would go below 1
            removeFromCart(product.id)
        } else {
            updateQuantity(product.id, newQuantity)
        }
    }

    return (
        <div className="group block">
            <motion.div
                whileHover={{ y: -4 }}
                className="relative bg-white overflow-hidden rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(255,153,51,0.3)] transition-all duration-300 border border-orange-50 flex flex-row"
            >
                {/* Image Section - Clickable */}
                <Link href={`/product/${product.id}`} className="relative w-48 md:w-64 h-48 flex-shrink-0 overflow-hidden bg-orange-50/30">
                    <Image
                        src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.png'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {product.isNew && (
                        <span className="absolute top-4 left-4 bg-magenta text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md z-10">
                            New Arrival
                        </span>
                    )}
                </Link>

                {/* Content Section */}
                <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                    <Link href={`/product/${product.id}`}>
                        <div>
                            <p className="text-saffron text-[10px] font-bold uppercase tracking-[0.15em] mb-1">
                                {product.categories && product.categories.length > 0 ? product.categories[0] : 'General'}
                            </p>
                            <h3 className="font-playfair text-base md:text-xl text-[#2D1B1B] group-hover:text-magenta transition-colors mb-2 leading-tight font-bold line-clamp-2">
                                {product.name}
                            </h3>
                            <p className="text-[#4A3737]/70 text-xs leading-relaxed mb-3 line-clamp-2">
                                {product.description}
                            </p>
                        </div>
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xl md:text-2xl font-bold text-[#2D1B1B]">
                                ₹{product.price}
                            </p>
                        </div>

                        {/* Quantity Selector - Only show if item is in cart */}
                        {isInCart && cartItem && (
                            <div className="flex items-center border border-orange-200 rounded-full bg-white shadow-sm">
                                <button
                                    onClick={() => handleQuantityChange(cartItem.quantity - 1)}
                                    className="p-2 hover:text-red-500 transition-colors"
                                >
                                    {cartItem.quantity === 1 ? (
                                        <Trash2 className="h-3 w-3" />
                                    ) : (
                                        <Minus className="h-3 w-3" />
                                    )}
                                </button>
                                <span className="w-8 text-center text-sm font-bold text-[#2D1B1B]">{cartItem.quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(cartItem.quantity + 1)}
                                    className="p-2 hover:text-saffron transition-colors"
                                >
                                    <Plus className="h-3 w-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
