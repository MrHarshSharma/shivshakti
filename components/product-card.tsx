
'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Product } from '@/data/products'

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Link href={`/product/${product.id}`} className="group block h-full">
            <motion.div
                whileHover={{ y: -8 }}
                className="relative bg-white overflow-hidden rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(255,153,51,0.3)] transition-all duration-300 h-full border border-orange-50"
            >
                <div className="aspect-[4/5] relative overflow-hidden bg-orange-50/30">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Quick Add Button */}
                    <button className="absolute bottom-4 right-4 h-12 w-12 bg-white text-saffron rounded-full flex items-center justify-center shadow-lg translate-y-20 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-saffron hover:text-white z-20">
                        <Plus className="h-6 w-6" />
                    </button>

                    {product.isNew && (
                        <span className="absolute top-4 left-4 bg-magenta text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                            New Arrival
                        </span>
                    )}
                </div>

                <div className="p-4 md:p-6 text-center">
                    <p className="text-saffron text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-1 md:mb-2 text-ellipsis overflow-hidden whitespace-nowrap">{product.category}</p>
                    <h3 className="font-playfair text-sm md:text-xl text-[#2D1B1B] group-hover:text-magenta transition-colors mb-1 md:mb-2 leading-tight font-bold line-clamp-2">
                        {product.name}
                    </h3>
                    <p className="text-[#4A3737]/80 text-sm md:text-base font-medium font-sans">
                        ₹{product.price}
                    </p>
                </div>
            </motion.div>
        </Link>
    )
}
