
'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/data/products'
import ProductCard from '@/components/product-card'
import { Loader2 } from 'lucide-react'

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
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('All')

    const categories = ['All', 'Hampers', 'Gourmet', 'Dry Fruits', 'Others']

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products', { cache: 'no-store' })
                const data = await response.json()
                if (data.success) {
                    setProducts(data.products || [])
                    setFilteredProducts(data.products || [])
                }
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [])

    useEffect(() => {
        if (activeCategory === 'All') {
            setFilteredProducts(products)
        } else {
            const filtered = products.filter(product =>
                product.categories && product.categories.some(cat => cat.toLowerCase() === activeCategory.toLowerCase())
            )
            setFilteredProducts(filtered)
        }
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

                {/* Filters */}
                <div className="flex justify-center gap-4 mb-16 text-sm font-bold tracking-wider uppercase overflow-x-auto py-4 px-4 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full shadow-sm transition-all whitespace-nowrap ${activeCategory === category
                                ? 'bg-[#2D1B1B] text-white shadow-lg scale-105'
                                : 'bg-white text-[#4A3737] hover:bg-orange-100 hover:text-saffron'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Product List */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin text-saffron mb-4" />
                        <p className="font-playfair text-[#4A3737]">Curating artisan hampers...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
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
