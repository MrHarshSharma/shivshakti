'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/data/products'
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

interface ProductsClientProps {
    products: Product[]
}

export default function ProductsClient({ products }: ProductsClientProps) {
    const [activeCategory, setActiveCategory] = useState('All')

    const categories = ['All', 'Hampers', 'Gourmet', 'Dry Fruits', 'Others']

    // Memoize filtered products to avoid recalculation on every render
    const filteredProducts = useMemo(() => {
        if (activeCategory === 'All') {
            return products
        }
        return products.filter(product =>
            product.categories && product.categories.some(cat => cat.toLowerCase() === activeCategory.toLowerCase())
        )
    }, [activeCategory, products])

    return (
        <div className="min-h-screen bg-[#FEFBF5] pt-28 pb-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-20 text-center">
                    <h1 className="text-2xl md:text-4xl lg:text-6xl font-cinzel text-[#2D1B1B] mb-6">The Collection</h1>
                    <p className="text-[#4A3737]/80 font-playfair text-lg max-w-2xl mx-auto">
                        Explore our carefully curated selection of heritage artifacts and textiles, ensuring a touch of luxury in every detail.
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="mb-16 -mx-4 px-4 overflow-x-auto scrollbar-hide">
                    <div className="flex justify-center min-w-max md:min-w-0">
                        <div className="inline-flex gap-1 md:gap-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-orange-100 shadow-sm">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`relative px-4 md:px-6 py-2 md:py-2.5 text-[11px] md:text-xs font-bold uppercase tracking-wider md:tracking-widest rounded-full transition-all duration-300 whitespace-nowrap ${
                                        activeCategory === category
                                            ? 'text-white'
                                            : 'text-[#4A3737] hover:text-saffron'
                                    }`}
                                >
                                    {activeCategory === category && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-saffron rounded-full shadow-md"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{category}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product List */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-orange-100 max-w-2xl mx-auto px-6">
                        <p className="text-xl font-playfair text-[#4A3737] mb-2 font-bold">No items found</p>
                        <p className="text-[#4A3737]/60">We don't have products in the "{activeCategory}" category yet.</p>
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-6 max-w-5xl mx-auto"
                    >
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={item}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    )
}
