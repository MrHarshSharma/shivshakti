'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Edit, Trash2, Search } from 'lucide-react'

interface Product {
    id: number
    name: string
    description: string
    price: number
    categories: string[]
    images: string[]
    created_at: string
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
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
            const response = await fetch('/api/products')
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

    const deleteProduct = async (productId: number) => {
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
        <div className="min-h-screen bg-[#FEFBF5] pt-32 pb-16">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin" className="text-saffron hover:text-orange-600 text-sm font-bold uppercase tracking-wider mb-4 inline-flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-cinzel text-4xl text-[#2D1B1B] mb-2">Products Management</h1>
                            <p className="text-[#4A3737]/70 font-playfair">Manage your product catalog</p>
                        </div>
                        <Link href="/admin/add-product">
                            <button className="px-6 py-3 bg-saffron text-white rounded-lg hover:bg-orange-600 transition-colors font-bold uppercase tracking-wider flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Add Product
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4A3737]/40" />
                        <input
                            type="text"
                            placeholder="Search products by name or category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white"
                        />
                    </div>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-saffron border-r-transparent"></div>
                        <p className="mt-4 text-[#4A3737]/70 font-playfair">Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-12 text-center">
                        <p className="text-[#4A3737]/70 font-playfair mb-4">No products found</p>
                        <Link href="/admin/add-product">
                            <button className="px-6 py-3 bg-saffron text-white rounded-lg hover:bg-orange-600 transition-colors font-bold uppercase tracking-wider">
                                Add Your First Product
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden group"
                            >
                                {/* Product Image */}
                                <div className="relative h-48 bg-orange-50/30">
                                    {product.images && product.images.length > 0 ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#4A3737]/30">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        <h3 className="font-playfair text-lg text-[#2D1B1B] font-bold mb-2 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-[#4A3737]/70 text-sm line-clamp-2 mb-3">
                                            {product.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {product.categories && product.categories.map((category) => (
                                                <span
                                                    key={category}
                                                    className="px-2 py-1 bg-orange-100 text-saffron text-xs rounded-full font-semibold"
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-2xl font-bold text-[#2D1B1B] font-cinzel">
                                            ₹{product.price}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                                            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-bold text-sm flex items-center justify-center gap-2">
                                                <Edit className="h-4 w-4" />
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold text-sm flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete
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
