'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/data/products'
import ProductCard from '@/components/product-card'
import { Package, Search, X, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface GourmetClientProps {
    products: Product[]
    currentPage: number
    totalPages: number
    totalProducts: number
    searchQuery: string
    currentSort: 'latest' | 'oldest'
}

export default function GourmetClient({
    products,
    currentPage,
    totalPages,
    totalProducts,
    searchQuery,
    currentSort
}: GourmetClientProps) {
    const router = useRouter()
    const [localSearch, setLocalSearch] = useState(searchQuery)
    const [activeSort, setActiveSort] = useState(currentSort)

    // Sync local state with props
    useEffect(() => {
        setLocalSearch(searchQuery)
    }, [searchQuery])

    useEffect(() => {
        setActiveSort(currentSort)
    }, [currentSort])

    const buildUrl = (params: { page?: number; search?: string; sort?: string }) => {
        const url = new URLSearchParams()
        const page = params.page ?? currentPage
        const search = params.search ?? searchQuery
        const sort = params.sort ?? currentSort

        if (page > 1) url.set('page', page.toString())
        if (search) url.set('search', search)
        if (sort && sort !== 'latest') url.set('sort', sort)

        const queryString = url.toString()
        return `/gourmet${queryString ? `?${queryString}` : ''}`
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        router.push(buildUrl({ search: localSearch.trim(), page: 1 }))
    }

    const handleSortChange = (sort: 'latest' | 'oldest') => {
        setActiveSort(sort)
        router.push(buildUrl({ sort, page: 1 }))
    }

    const handlePageChange = (page: number) => {
        router.push(buildUrl({ page }))
    }

    const clearSearch = () => {
        setLocalSearch('')
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
                            Gourmet Collection
                        </h1>
                        <p className="text-[#4A4A4A] text-lg leading-relaxed">
                            Discover our exquisite gourmet selection, featuring premium quality ingredients and artisanal craftsmanship in every product.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filters Section */}
            <div className="sticky top-0 md:top-12 z-30 bg-white border-b border-[#EBEBEB] shadow-sm">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative w-full sm:w-80">
                            <input
                                type="text"
                                placeholder="Search gourmet products..."
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                className="w-full pl-4 pr-20 py-2.5 border border-[#E0E0E0] rounded-lg text-sm focus:outline-none focus:border-[#D29B6C] transition-colors"
                            />
                            <div className="absolute right-2 inset-y-0 flex items-center gap-1">
                                {localSearch && (
                                    <button
                                        type="button"
                                        onClick={() => setLocalSearch('')}
                                        className="p-1 text-[#999] hover:text-[#666] transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="p-1.5 bg-[#D29B6C] text-white rounded-md hover:bg-[#B8845A] transition-colors"
                                >
                                    <Search className="w-4 h-4" />
                                </button>
                            </div>
                        </form>

                        {/* Sort Filter */}
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="w-4 h-4 text-[#717171]" />
                            <span className="text-sm text-[#717171]">Sort:</span>
                            <div className="inline-flex gap-1 p-1 bg-[#F8F8F8] rounded-lg">
                                <button
                                    onClick={() => handleSortChange('latest')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                                        activeSort === 'latest'
                                            ? 'bg-[#D29B6C] text-white'
                                            : 'text-[#4A4A4A] hover:text-[#D29B6C]'
                                    }`}
                                >
                                    Latest
                                </button>
                                <button
                                    onClick={() => handleSortChange('oldest')}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                                        activeSort === 'oldest'
                                            ? 'bg-[#D29B6C] text-white'
                                            : 'text-[#4A4A4A] hover:text-[#D29B6C]'
                                    }`}
                                >
                                    Oldest
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-6">
                    {/* Results count */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-[#717171]">
                            Showing <span className="font-medium text-[#1A1A1A]">{products.length}</span> of <span className="font-medium text-[#1A1A1A]">{totalProducts}</span> {totalProducts === 1 ? 'product' : 'products'}
                            {searchQuery && <span> for &quot;<span className="font-medium text-[#D29B6C]">{searchQuery}</span>&quot;</span>}
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
                                <p className="text-xl font-semibold text-[#1A1A1A] mb-2">No gourmet products found</p>
                                <p className="text-[#717171]">
                                    {searchQuery
                                        ? `No results for "${searchQuery}" in our gourmet collection.`
                                        : 'Our gourmet collection is coming soon.'
                                    }
                                </p>
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="mt-6 px-6 py-2.5 bg-[#D29B6C] text-white font-medium rounded-lg hover:bg-[#B8845A] transition-colors"
                                    >
                                        Clear Search
                                    </button>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`gourmet-${currentPage}-${currentSort}`}
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
