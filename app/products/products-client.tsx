'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/data/products'
import ProductCard from '@/components/product-card'
import { Package, Search, X } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

interface ProductsClientProps {
    products: Product[]
}

export default function ProductsClient({ products }: ProductsClientProps) {
    const [activeCategory, setActiveCategory] = useState('All')
    const searchParams = useSearchParams()
    const router = useRouter()
    const searchQuery = searchParams.get('search') || ''

    const categories = ['All', 'Hampers', 'Gourmet', 'Dry Fruits']

    const clearSearch = () => {
        router.push('/products')
    }

    // Memoize filtered products to avoid recalculation on every render
    const filteredProducts = useMemo(() => {
        let filtered = products

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                (product.categories && product.categories.some(cat => cat.toLowerCase().includes(query)))
            )
        }

        // Filter by category
        if (activeCategory !== 'All') {
            filtered = filtered.filter(product =>
                product.categories && product.categories.some(cat => cat.toLowerCase() === activeCategory.toLowerCase())
            )
        }

        return filtered
    }, [activeCategory, products, searchQuery])

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-[#EBDDC4] pt-12 pb-12 md:pt-16 md:pb-16">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
                            {searchQuery ? 'Search Results' : 'Our Collection'}
                        </h1>
                        <p className="text-[#4A4A4A] text-lg leading-relaxed">
                            {searchQuery
                                ? `Showing results for "${searchQuery}"`
                                : 'Explore our carefully curated selection of premium gift hampers, ensuring a touch of luxury in every detail.'
                            }
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Category Tabs */}
            <div className="sticky top-0 md:top-12 z-30 bg-white border-b border-[#EBEBEB] shadow-sm">
                <div className="container mx-auto px-6">
                    <div className="flex justify-center py-4 overflow-x-auto scrollbar-hide">
                        <div className="inline-flex gap-2 p-1 bg-[#F8F8F8] rounded-lg">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`relative px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap ${activeCategory === category
                                        ? 'text-white'
                                        : 'text-[#4A4A4A] hover:text-[#D29B6C]'
                                        }`}
                                >
                                    {activeCategory === category && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-[#D29B6C] rounded-lg"
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
                    {/* Search indicator & Results count */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-[#717171]">
                            Showing <span className="font-medium text-[#1A1A1A]">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
                            {searchQuery && <span> for &quot;<span className="font-medium text-[#D29B6C]">{searchQuery}</span>&quot;</span>}
                            {activeCategory !== 'All' && <span> in <span className="font-medium text-[#D29B6C]">{activeCategory}</span></span>}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#4A4A4A] bg-[#F8F8F8] rounded-lg hover:bg-[#EBEBEB] transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Clear search
                            </button>
                        )}
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
                                <div className="w-16 h-16 bg-[#EBDDC4] rounded-full flex items-center justify-center mx-auto mb-4 text-[#D29B6C]">
                                    {searchQuery ? <Search className="h-8 w-8" /> : <Package className="h-8 w-8" />}
                                </div>
                                <p className="text-xl font-semibold text-[#1A1A1A] mb-2">No products found</p>
                                <p className="text-[#717171]">
                                    {searchQuery
                                        ? `No results for "${searchQuery}"${activeCategory !== 'All' ? ` in ${activeCategory}` : ''}.`
                                        : `We don't have products in "${activeCategory}" yet.`
                                    }
                                </p>
                                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                                    {searchQuery && (
                                        <button
                                            onClick={clearSearch}
                                            className="px-6 py-2.5 bg-[#D29B6C] text-white font-medium rounded-lg hover:bg-[#B8845A] transition-colors"
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                    {activeCategory !== 'All' && (
                                        <button
                                            onClick={() => setActiveCategory('All')}
                                            className={`px-6 py-2.5 font-medium rounded-lg transition-colors ${searchQuery
                                                ? 'text-[#D29B6C] border border-[#D29B6C] hover:bg-[#FDF8F3]'
                                                : 'bg-[#D29B6C] text-white hover:bg-[#B8845A]'
                                                }`}
                                        >
                                            View All Categories
                                        </button>
                                    )}
                                </div>
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
