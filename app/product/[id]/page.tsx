
'use client'

import React, { useState, useEffect } from 'react'
import { products } from '@/data/products'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Star, Sparkles, Minus, Plus } from 'lucide-react'
import { useCart } from '@/context/cart-context'

// Correctly typing params as a Promise for Next.js 15
export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { addToCart } = useCart()
    const [quantity, setQuantity] = useState(1)

    // Unwrap params using React.use() or async/await pattern if this was a server component,
    // but since we need 'use client' for state, we need to handle async params carefully.
    // In Next.js 15 client components, params is a promise.
    const [id, setId] = useState<string | null>(null)

    useEffect(() => {
        params.then((resolvedParams) => setId(resolvedParams.id))
    }, [params])

    if (!id) return null; // Loading state

    const product = products.find((p) => p.id === id)

    if (!product) {
        notFound()
    }

    const handleAddToCart = () => {
        addToCart(product, quantity)
    }

    return (
        <div className="min-h-screen bg-[#FEFBF5] pt-32 pb-20">
            <div className="container mx-auto px-4">
                <Link
                    href="/products"
                    className="inline-flex items-center text-[#4A3737]/60 hover:text-saffron transition-colors mb-12 uppercase tracking-widest text-sm font-bold"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Collection
                </Link>

                <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
                    {/* Image */}
                    <div className="relative aspect-[3/4] bg-white rounded-3xl overflow-hidden shadow-2xl skew-y-1 transform transition-transform hover:skew-y-0 duration-700">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        {product.isNew && (
                            <div className="absolute top-6 right-6 bg-magenta text-white px-4 py-2 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg animate-pulse">
                                New Arrival
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-saffron" />
                            <span className="text-saffron uppercase tracking-[0.2em] text-sm font-bold block">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-cinzel text-[#2D1B1B] mb-6 leading-tight">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-3xl text-[#4A3737] font-bold">
                                ₹{product.price}
                            </span>
                            <div className="flex text-gold">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-current" />
                                ))}
                            </div>
                        </div>

                        <p className="text-[#4A3737]/80 font-playfair text-lg leading-relaxed mb-10 border-l-4 border-magenta/20 pl-6">
                            {product.description}
                        </p>

                        <div className="space-y-8">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold uppercase tracking-wider text-[#4A3737]">Quantity</span>
                                <div className="flex items-center border border-orange-200 rounded-full bg-white shadow-sm">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="p-3 hover:text-magenta transition-colors"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-8 text-center font-bold text-[#2D1B1B]">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="p-3 hover:text-saffron transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full md:w-auto px-12 py-5 bg-saffron text-white font-bold tracking-widest uppercase hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-orange-300/50 flex items-center justify-center gap-3 rounded-full"
                            >
                                <ShoppingCart className="h-5 w-5" /> Add to Cart
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
