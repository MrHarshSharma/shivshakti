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
                <div className="mb-8">
                    <Link href="/admin" className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-orange-100 text-saffron hover:text-orange-600 text-xs font-bold uppercase tracking-wider mb-6 transition-all group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="font-cinzel text-4xl text-[#2D1B1B] mb-1 font-bold tracking-tight">Products <span className="text-saffron">Catalog</span></h1>
                            <p className="text-[#4A3737]/70 font-playfair text-base">Curate your artisanal collection.</p>
                        </div>
                        <Link href="/admin/add-product">
                            <button className="px-6 py-3 bg-[#2D1B1B] text-white rounded-full hover:bg-saffron transition-all font-bold uppercase tracking-widest text-xs flex items-center gap-3 shadow-lg hover:shadow-saffron/40 group">
                                <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                                Add Product
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Search - More Compact */}
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 p-6 shadow-sm mb-8">

                    <div className="relative justify-center align-middle mx-auto flex flex-row gap-4">
                        <div className="w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-saffron/40" />
                            <input
                                type="text"
                                placeholder="Search by name or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-6 py-3 border border-orange-100 rounded-xl font-playfair text-base focus:outline-none focus:ring-4 focus:ring-saffron/5 bg-white/80 transition-all placeholder:text-[#4A3737]/30 shadow-inner"
                            />
                        </div>

                        {filteredProducts.length > 0 && (
                            <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-orange-100 p-5">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                                    <div>
                                        <p className="text-[#4A3737]/50 text-[10px] uppercase font-bold tracking-widest mb-1">Stock Count</p>
                                        <p className="text-xl font-bold text-[#2D1B1B] font-cinzel">{filteredProducts.length}</p>
                                    </div>
                                    <div className="border-y sm:border-y-0 sm:border-x border-orange-50 py-3 sm:py-0 sm:px-6">
                                        <p className="text-[#4A3737]/50 text-[10px] uppercase font-bold tracking-widest mb-1">Avg Price</p>
                                        <p className="text-xl font-bold text-[#2D1B1B] font-cinzel">
                                            ₹{Math.round(filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length)}
                                        </p>
                                    </div>
                                    <div className="sm:pl-6">
                                        <p className="text-[#4A3737]/50 text-[10px] uppercase font-bold tracking-widest mb-1">Total Value</p>
                                        <p className="text-xl font-bold text-saffron font-cinzel">
                                            ₹{filteredProducts.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="text-center py-24">
                        <div className="inline-block h-10 w-10 animate-spin rounded-full border-[3px] border-solid border-saffron border-r-transparent"></div>
                        <p className="mt-4 text-[#4A3737]/60 font-playfair italic text-sm">Dusting off the shelves...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/40 p-20 text-center">
                        <Package className="h-16 w-16 text-[#4A3737]/10 mx-auto mb-4" />
                        <p className="text-[#4A3737]/60 font-playfair text-xl mb-6">The showroom is currently vacant.</p>
                        <Link href="/admin/add-product">
                            <button className="px-8 py-3 bg-saffron text-white rounded-full hover:bg-orange-600 transition-all font-bold uppercase tracking-widest text-xs shadow-md">
                                Unveil Your First Creation
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/60 overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                {/* Compact Image Container */}
                                <div className="relative h-48 overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-orange-50 text-[#4A3737]/20 uppercase tracking-widest font-bold text-[10px]">
                                            No Vision
                                        </div>
                                    )}
                                    {/* Floating Badges */}
                                    <div className="absolute bottom-3 left-3 flex gap-2">
                                        {/* Product Type Badge */}
                                        {(product as any).product_type && (
                                            <span className={`px-2.5 py-1 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border ${(product as any).product_type === 'variable'
                                                    ? 'bg-purple-500/90 text-white border-purple-600/50'
                                                    : 'bg-white/90 text-[#2D1B1B] border-orange-50'
                                                }`}>
                                                {(product as any).product_type === 'variable' ? 'Variable' : 'Simple'}
                                            </span>
                                        )}

                                        {/* Price Badge */}
                                        <span className="px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-sm font-bold text-[#2D1B1B] shadow-sm border border-orange-50">
                                            {(product as any).product_type === 'variable' && (product as any).variations ? (
                                                (() => {
                                                    const prices = (product as any).variations.map((v: any) => v.price)
                                                    const minPrice = Math.min(...prices)
                                                    const maxPrice = Math.max(...prices)
                                                    return minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`
                                                })()
                                            ) : (
                                                `₹${product.price}`
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Refined Product Info */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="font-playfair text-lg text-[#2D1B1B] font-bold mb-1 line-clamp-1 group-hover:text-saffron transition-colors">
                                            {product.name}
                                        </h3>

                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {product.categories && product.categories.map((category) => (
                                                <span
                                                    key={category}
                                                    className="px-2 py-0.5 bg-orange-50/50 border border-orange-100/50 text-saffron text-[9px] font-bold uppercase tracking-wider rounded-md"
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>

                                        <p className="text-[#4A3737]/60 text-xs line-clamp-2 font-playfair italic min-h-[32px] leading-relaxed">
                                            {(() => {
                                                try {
                                                    const jsonDesc = JSON.parse(product.description);
                                                    return jsonDesc.productDescription || product.description;
                                                } catch {
                                                    return product.description;
                                                }
                                            })()}
                                        </p>
                                    </div>

                                    {/* Compact Actions */}
                                    <div className="flex gap-2 pt-4 border-t border-orange-50 mt-auto">
                                        <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                                            <button className="w-full py-2.5 bg-[#2D1B1B] text-white rounded-xl hover:bg-saffron transition-all font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm">
                                                <Edit className="h-3.5 w-3.5" />
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="p-2.5 bg-red-50 h-9 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100 shadow-sm"
                                            title="Delete Product"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Summary Section - Scaled Down */}

            </div>
        </div>
    )
}