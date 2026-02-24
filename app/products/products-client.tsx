'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/data/products'
import ProductCard from '@/components/product-card'
import { Package } from 'lucide-react'

interface ProductsClientProps {
    products: Product[]
}

export default function ProductsClient({ products }: ProductsClientProps) {
    const [activeCategory, setActiveCategory] = useState('All')

    const categories = ['All', 'Hampers', 'Gourmet', 'Dry Fruits']

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
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-[#FDF2F4] pt-12 pb-12 md:pt-16 md:pb-16">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">Our Collection</h1>
                        <p className="text-[#4A4A4A] text-lg leading-relaxed">
                            Explore our carefully curated selection of premium gift hampers, ensuring a touch of luxury in every detail.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Category Tabs */}
            <div className="sticky top-16 z-30 bg-white border-b border-[#EBEBEB] shadow-sm">
                <div className="container mx-auto px-6">
                    <div className="flex justify-center py-4 overflow-x-auto scrollbar-hide">
                        <div className="inline-flex gap-2 p-1 bg-[#F8F8F8] rounded-lg">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`relative px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap ${activeCategory === category
                                        ? 'text-white'
                                        : 'text-[#4A4A4A] hover:text-[#8B1538]'
                                        }`}
                                >
                                    {activeCategory === category && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-[#8B1538] rounded-lg"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{category}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-6">
                    {/* Results count */}
                    <div className="mb-8 flex items-center justify-between">
                        <p className="text-[#717171]">
                            Showing <span className="font-medium text-[#1A1A1A]">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
                            {activeCategory !== 'All' && <span> in <span className="font-medium text-[#8B1538]">{activeCategory}</span></span>}
                        </p>
                    </div>

                    {/* Product Grid */}
                    <AnimatePresence mode="wait">
                        {filteredProducts.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-20 bg-[#F8F8F8] rounded-xl border border-[#EBEBEB] max-w-lg mx-auto"
                            >
                                <div className="w-16 h-16 bg-[#FDF2F4] rounded-full flex items-center justify-center mx-auto mb-4 text-[#8B1538]">
                                    <Package className="h-8 w-8" />
                                </div>
                                <p className="text-xl font-semibold text-[#1A1A1A] mb-2">No products found</p>
                                <p className="text-[#717171]">We don&apos;t have products in &quot;{activeCategory}&quot; yet.</p>
                                <button
                                    onClick={() => setActiveCategory('All')}
                                    className="mt-6 px-6 py-2.5 bg-[#8B1538] text-white font-medium rounded-lg hover:bg-[#6B102B] transition-colors"
                                >
                                    View All Products
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                            >
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    )
}
