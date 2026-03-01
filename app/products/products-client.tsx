'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/data/products'
import ProductCard from '@/components/product-card'
import { Package, Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProductsClientProps {
    products: Product[]
    currentPage: number
    totalPages: number
    totalProducts: number
    currentCategory: string
    searchQuery: string
}

export default function ProductsClient({
    products,
    currentPage,
    totalPages,
    totalProducts,
    currentCategory,
    searchQuery
}: ProductsClientProps) {
    const router = useRouter()

    const categories = ['All', 'Hampers', 'Gourmet', 'Dry fruits']

    const buildUrl = (params: { page?: number; category?: string; search?: string }) => {
        const url = new URLSearchParams()
        const page = params.page ?? currentPage
        const category = params.category ?? currentCategory
        const search = params.search ?? searchQuery

        if (page > 1) url.set('page', page.toString())
        if (category && category !== 'All') url.set('category', category)
        if (search) url.set('search', search)

        const queryString = url.toString()
        return `/products${queryString ? `?${queryString}` : ''}`
    }

    const handleCategoryChange = (category: string) => {
        router.push(buildUrl({ category, page: 1 }))
    }

    const handlePageChange = (page: number) => {
        router.push(buildUrl({ page }))
    }

    const clearSearch = () => {
        router.push(buildUrl({ search: '', page: 1 }))
    }

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
                                    onClick={() => handleCategoryChange(category)}
                                    className={`relative px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap ${currentCategory === category
                                        ? 'text-white'
                                        : 'text-[#4A4A4A] hover:text-[#D29B6C]'
                                        }`}
                                >
                                    {currentCategory === category && (
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
                            Showing <span className="font-medium text-[#1A1A1A]">{products.length}</span> of <span className="font-medium text-[#1A1A1A]">{totalProducts}</span> {totalProducts === 1 ? 'product' : 'products'}
                            {searchQuery && <span> for &quot;<span className="font-medium text-[#D29B6C]">{searchQuery}</span>&quot;</span>}
                            {currentCategory !== 'All' && <span> in <span className="font-medium text-[#D29B6C]">{currentCategory}</span></span>}
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
                        {products.length === 0 ? (
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
                                        ? `No results for "${searchQuery}"${currentCategory !== 'All' ? ` in ${currentCategory}` : ''}.`
                                        : `We don't have products in "${currentCategory}" yet.`
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
                                    {currentCategory !== 'All' && (
                                        <button
                                            onClick={() => handleCategoryChange('All')}
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
                                key={`${currentCategory}-${currentPage}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                            >
                                {products.map((product, index) => (
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-[#EBEBEB] hover:bg-[#F8F8F8] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="h-5 w-5 text-[#4A4A4A]" />
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNum: number
                                    if (totalPages <= 5) {
                                        pageNum = i + 1
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i
                                    } else {
                                        pageNum = currentPage - 2 + i
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${currentPage === pageNum
                                                ? 'bg-[#D29B6C] text-white shadow-lg'
                                                : 'border border-[#EBEBEB] text-[#4A4A4A] hover:bg-[#F8F8F8]'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                })}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-[#EBEBEB] hover:bg-[#F8F8F8] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="h-5 w-5 text-[#4A4A4A]" />
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
