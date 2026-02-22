'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/data/products'
import ProductCard from '@/components/product-card'
import { ChevronDown } from 'lucide-react'

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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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

                {/* Professional Category Dropdown */}
                <div className="flex justify-center mb-16 relative z-30">
                    <div className="relative w-full max-w-xs">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full flex items-center justify-between px-6 py-3 bg-white border border-orange-100 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                        >
                            <span className="text-sm font-black uppercase tracking-[0.2em] text-[#4A3737]">
                                {activeCategory}
                            </span>
                            <ChevronDown className={`h-4 w-4 text-saffron transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <>
                                    {/* Backdrop for closing */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsDropdownOpen(false)}
                                    />

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 w-full mt-2 bg-white/90 backdrop-blur-xl border border-orange-100 rounded-2xl shadow-xl overflow-hidden z-20"
                                    >
                                        <div className="py-2">
                                            {categories.map((category) => (
                                                <button
                                                    key={category}
                                                    onClick={() => {
                                                        setActiveCategory(category)
                                                        setIsDropdownOpen(false)
                                                    }}
                                                    className={`w-full text-left px-6 py-3 text-xs font-black uppercase tracking-widest transition-colors ${activeCategory === category
                                                        ? 'bg-orange-50 text-saffron'
                                                        : 'text-[#4A3737] hover:bg-orange-50/50 hover:text-saffron'
                                                        }`}
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
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
