
'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { Product } from '@/data/products'
import { useCart } from '@/context/cart-context'

export default function ProductCard({ product }: { product: Product }) {


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
                                {product.categories && product.categories.length > 0 ? product.categories.map(category => <span key={category} className="bg-orange-50 text-saffron px-3 py-1 rounded-full text-[7px] font-bold uppercase tracking-wider border border-orange-100 ml-0 mr-1">{category}</span>) : 'General'}
                            </p>
                            <h3 className="font-playfair text-base md:text-xl text-[#2D1B1B] group-hover:text-magenta transition-colors mb-2 leading-tight font-bold line-clamp-2">
                                {product.name}
                            </h3>
                            <p className="text-[#4A3737]/70 text-xs leading-relaxed mb-3 line-clamp-2">
                                {(() => {
                                    try {
                                        const jsonDesc = JSON.parse(product.description);
                                        return jsonDesc.productDescription || product.description;
                                    } catch {
                                        return product.description;
                                    }
                                })()}
                            </p>
                        </div>
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xl md:text-2xl font-bold text-[#2D1B1B]">
                                {(product as any).product_type === 'variable' && (product as any).variations ? (() => {
                                    const prices = (product as any).variations.map((v: any) => v.price)
                                    const minPrice = Math.min(...prices)
                                    const maxPrice = Math.max(...prices)
                                    return minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`
                                })() : `₹${product.price}`}
                            </p>
                            {(product as any).product_type === 'variable' && (
                                <p className="text-[10px] text-saffron font-bold uppercase tracking-wider mt-0.5">
                                    {(product as any).variations?.length} Variations
                                </p>
                            )}
                        </div>


                    </div>
                </div>
            </motion.div>
        </div>
    )
}
