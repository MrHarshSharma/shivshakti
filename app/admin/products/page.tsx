'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Edit, Trash2, Search, Package } from 'lucide-react'
import { Product } from '@/data/products'

interface AdminProduct extends Product {
    created_at: string
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<AdminProduct[]>([])
    const [filteredProducts, setFilteredProducts] = useState<AdminProduct[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        filterProducts()
    }, [searchTerm, products])

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products', { cache: 'no-store' })
            const data = await response.json()

            if (data.success) {
                setProducts(data.products || [])
            }
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filterProducts = () => {
        if (searchTerm) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            setFilteredProducts(filtered)
        } else {
            setFilteredProducts(products)
        }
    }

    const deleteProduct = async (productId: string | number) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                fetchProducts()
            }
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    return (
        <div className="min-h-screen bg-[#FEFBF5] relative overflow-hidden pt-32 pb-16">
            {/* Background Patterns */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/20 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-magenta/10 rounded-full blur-[100px] -ml-64 -mb-64 animate-pulse animation-delay-2000" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/admin" className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-orange-100 text-saffron hover:text-orange-600 text-xs font-bold uppercase tracking-wider mb-6 transition-all">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="font-cinzel text-5xl text-[#2D1B1B] mb-2 font-bold tracking-tight">Products <span className="text-saffron">Catalog</span></h1>
                            <p className="text-[#4A3737]/70 font-playfair text-lg">Curate your artisanal collection.</p>
                        </div>
                        <Link href="/admin/add-product">
                            <button className="px-8 py-4 bg-[#2D1B1B] text-white rounded-full hover:bg-saffron transition-all font-bold uppercase tracking-widest flex items-center gap-3 shadow-xl hover:shadow-saffron/40 group">
                                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                                Add Product
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Search - Glassmorphism */}
                <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/40 p-8 shadow-xl mb-12">
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-saffron/40" />
                        <input
                            type="text"
                            placeholder="Discover products by name or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 border border-orange-100 rounded-2xl font-playfair text-lg focus:outline-none focus:ring-4 focus:ring-saffron/10 bg-white/80 transition-all placeholder:text-[#4A3737]/30 shadow-inner"
                        />
                    </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="text-center py-24">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-[3px] border-solid border-saffron border-r-transparent"></div>
                        <p className="mt-6 text-[#4A3737]/60 font-playfair italic">Dusting off the shelves...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/40 p-24 text-center">
                        <Package className="h-20 w-20 text-[#4A3737]/10 mx-auto mb-6" />
                        <p className="text-[#4A3737]/60 font-playfair text-2xl mb-8">The showroom is currently vacant.</p>
                        <Link href="/admin/add-product">
                            <button className="px-10 py-4 bg-saffron text-white rounded-full hover:bg-orange-600 transition-all font-bold uppercase tracking-widest shadow-lg">
                                Unveil Your First Creation
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/50 overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* Product Image */}
                                <div className="relative h-64 overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-orange-50 text-[#4A3737]/20 uppercase tracking-widest font-bold text-xs">
                                            No Vision Available
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                {/* Product Info */}
                                <div className="p-8">
                                    <div className="mb-6">
                                        <h3 className="font-playfair text-xl text-[#2D1B1B] font-bold mb-3 line-clamp-1 group-hover:text-saffron transition-colors">
                                            {product.name}
                                        </h3>
                                        <p className="text-[#4A3737]/60 text-sm line-clamp-2 mb-4 font-playfair italic min-h-[40px]">
                                            "{product.description}"
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-6 min-h-[30px]">
                                            {product.categories && product.categories.map((category) => (
                                                <span
                                                    key={category}
                                                    className="px-3 py-1 bg-white border border-orange-100 text-saffron text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm"
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <p className="text-3xl font-bold text-[#2D1B1B] font-cinzel tracking-tight">
                                                ₹{product.price}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-6 border-t border-orange-50">
                                        <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                                            <button className="w-full px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 border border-blue-100 shadow-sm">
                                                <Edit className="h-4 w-4" />
                                                Redesign
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 border border-red-100 shadow-sm"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Summary */}
                {filteredProducts.length > 0 && (
                    <div className="mt-6 bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-[#4A3737]/70 text-sm font-playfair mb-1">Total Products</p>
                                <p className="text-2xl font-bold text-[#2D1B1B] font-cinzel">{filteredProducts.length}</p>
                            </div>
                            <div>
                                <p className="text-[#4A3737]/70 text-sm font-playfair mb-1">Average Price</p>
                                <p className="text-2xl font-bold text-[#2D1B1B] font-cinzel">
                                    ₹{Math.round(filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[#4A3737]/70 text-sm font-playfair mb-1">Total Inventory Value</p>
                                <p className="text-2xl font-bold text-[#2D1B1B] font-cinzel">
                                    ₹{filteredProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
