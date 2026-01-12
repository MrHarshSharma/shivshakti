
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { products } from '@/data/products'
import ProductCard from '@/components/product-card'

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-[#FEFBF5] pt-28 pb-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-20 text-center">
                    <h1 className="text-4xl md:text-6xl font-cinzel text-[#2D1B1B] mb-6">The Collection</h1>
                    <p className="text-[#4A3737]/80 font-playfair text-lg max-w-2xl mx-auto">
                        Explore our carefully curated selection of heritage artifacts and textiles, ensuring a touch of luxury in every detail.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-4 mb-16 text-sm font-bold tracking-wider uppercase overflow-x-auto py-4 px-4">
                    <button className="bg-[#2D1B1B] text-white px-6 py-2 rounded-full shadow-lg scale-105 transition-transform">All</button>
                    <button className="bg-white text-[#4A3737] hover:bg-orange-100 hover:text-saffron px-6 py-2 rounded-full shadow-sm transition-all whitespace-nowrap">Hampers</button>
                    <button className="bg-white text-[#4A3737] hover:bg-pink-100 hover:text-magenta px-6 py-2 rounded-full shadow-sm transition-all whitespace-nowrap">Gourmet</button>
                    <button className="bg-white text-[#4A3737] hover:bg-green-100 hover:text-emerald px-6 py-2 rounded-full shadow-sm transition-all whitespace-nowrap">Chocolates</button>
                    <button className="bg-white text-[#4A3737] hover:bg-yellow-100 hover:text-yellow-600 px-6 py-2 rounded-full shadow-sm transition-all whitespace-nowrap">Wellness</button>
                    <button className="bg-white text-[#4A3737] hover:bg-orange-100 hover:text-saffron px-6 py-2 rounded-full shadow-sm transition-all whitespace-nowrap">Dry Fruits</button>
                </div>

                {/* Product Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
                >
                    {products.map((product) => (
                        <motion.div key={product.id} variants={item}>
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
