'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Package, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, Truck, Store } from 'lucide-react'
import { formatDate } from '@/utils/date'
import Image from 'next/image'

interface Order {
    id: number
    status: string
    payment_status: string
    order: {
        total: number
        itemCount: number
        items: Array<{
            id: string
            name: string
            price: number
            quantity: number
            image: string
        }>
    }
    created_at: string
}

interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

const ITEMS_PER_PAGE = 10

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: ITEMS_PER_PAGE,
        total: 0,
        totalPages: 0
    })
    const [isLoading, setIsLoading] = useState(true)
    const [cancellingId, setCancellingId] = useState<number | null>(null)

    const fetchOrders = useCallback(async (page: number) => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: ITEMS_PER_PAGE.toString()
            })
            const response = await fetch(`/api/user/orders?${params}`)
            const data = await response.json()
            if (data.success) {
                setOrders(data.orders || [])
                setPagination(data.pagination)
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchOrders(1)
    }, [fetchOrders])

    const handlePageChange = (newPage: number) => {
        fetchOrders(newPage)
    }

    const handleCancelOrder = async (orderId: number) => {
        if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            return
        }

        setCancellingId(orderId)
        try {
            const response = await fetch(`/api/user/orders/${orderId}/cancel`, {
                method: 'POST',
            })
            const data = await response.json()

            if (data.success) {
                await fetchOrders(pagination.page)
            } else {
                alert(data.error || 'Failed to cancel order')
            }
        } catch (error) {
            console.error('Error cancelling order:', error)
            alert('An error occurred while cancelling the order')
        } finally {
            setCancellingId(null)
        }
    }

    const getStatusTheme = (status: string) => {
        switch (status) {
            case 'completed': return {
                bg: 'bg-emerald-500',
                text: 'text-white',
                label: 'Completed',
                icon: <CheckCircle className="h-3.5 w-3.5" />
            }
            case 'cancelled': return {
                bg: 'bg-red-500',
                text: 'text-white',
                label: 'Cancelled',
                icon: <XCircle className="h-3.5 w-3.5" />
            }
            default: return {
                bg: 'bg-amber-500',
                text: 'text-white',
                label: 'Processing',
                icon: <Clock className="h-3.5 w-3.5" />
            }
        }
    }

    const startIndex = (pagination.page - 1) * pagination.limit + 1
    const endIndex = Math.min(pagination.page * pagination.limit, pagination.total)

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
                        <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">My Orders</h1>
                        <p className="text-[#4A4A4A] text-lg leading-relaxed">
                            Track and manage your orders
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Orders Section */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-6 max-w-4xl">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-10 h-10 border-2 border-[#8B1538] border-t-transparent rounded-full"
                            />
                            <p className="mt-4 text-[#717171]">Loading orders...</p>
                        </div>
                    ) : pagination.total === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-[#F8F8F8] rounded-xl p-12 text-center border border-[#EBEBEB]"
                        >
                            <div className="w-20 h-20 bg-[#FDF2F4] rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShoppingBag className="h-10 w-10 text-[#8B1538]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">No Orders Yet</h2>
                            <p className="text-[#717171] mb-8">Start shopping to see your orders here</p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-[#8B1538] text-white font-semibold rounded-lg hover:bg-[#6B102B] transition-colors"
                            >
                                Browse Products
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            {/* Results Count */}
                            <div className="mb-6">
                                <p className="text-[#717171]">
                                    Showing <span className="font-medium text-[#1A1A1A]">{startIndex}-{endIndex}</span> of{' '}
                                    <span className="font-medium text-[#1A1A1A]">{pagination.total}</span> orders
                                </p>
                            </div>

                            {/* Orders List */}
                            <div className="space-y-4">
                                {orders.map((order, idx) => {
                                    const theme = getStatusTheme(order.status)
                                    const isStorePickup = order.payment_status === 'store payment'

                                    return (
                                        <motion.div
                                            key={order.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="bg-white rounded-xl border border-[#EBEBEB] overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            {/* Order Header */}
                                            <div className="px-5 py-4 bg-[#F8F8F8] border-b border-[#EBEBEB] flex flex-wrap items-center justify-between gap-3">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Package className="h-5 w-5 text-[#8B1538]" />
                                                        <span className="font-bold text-[#1A1A1A]">Order #{order.id}</span>
                                                    </div>
                                                    <span className="text-sm text-[#717171]">{formatDate(order.created_at)}</span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {/* Delivery Type Badge */}
                                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${isStorePickup ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                        {isStorePickup ? (
                                                            <>
                                                                <Store className="h-3.5 w-3.5" />
                                                                Store Pickup
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Truck className="h-3.5 w-3.5" />
                                                                Delivery
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className={`${theme.bg} ${theme.text} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5`}>
                                                        {theme.icon}
                                                        {theme.label}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="p-5">
                                                <div className="space-y-4">
                                                    {order.order.items.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-4">
                                                            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-[#F8F8F8] flex-shrink-0">
                                                                <Image
                                                                    src={item.image || '/placeholder-product.png'}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-medium text-[#1A1A1A] truncate">{item.name}</h3>
                                                                <p className="text-sm text-[#717171]">
                                                                    Qty: {item.quantity} x ₹{item.price.toLocaleString()}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-semibold text-[#1A1A1A]">
                                                                    ₹{(item.price * item.quantity).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Order Total & Actions */}
                                                <div className="mt-5 pt-4 border-t border-[#EBEBEB] flex items-center justify-between">
                                                    <div>
                                                        <span className="text-sm text-[#717171]">Order Total</span>
                                                        <p className="text-xl font-bold text-[#1A1A1A]">₹{order.order.total.toLocaleString()}</p>
                                                    </div>

                                                    {order.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleCancelOrder(order.id)}
                                                            disabled={cancellingId === order.id}
                                                            className="px-5 py-2 border border-red-200 text-red-500 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                                        >
                                                            {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#F8F8F8] rounded-xl border border-[#EBEBEB]">
                                    <p className="text-sm text-[#717171]">
                                        Page <span className="font-medium text-[#1A1A1A]">{pagination.page}</span> of{' '}
                                        <span className="font-medium text-[#1A1A1A]">{pagination.totalPages}</span>
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page === 1 || isLoading}
                                            className="p-2 rounded-lg border border-[#EBEBEB] bg-white hover:bg-[#F8F8F8] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronLeft className="h-5 w-5 text-[#4A4A4A]" />
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                                                let pageNum: number
                                                if (pagination.totalPages <= 5) {
                                                    pageNum = i + 1
                                                } else if (pagination.page <= 3) {
                                                    pageNum = i + 1
                                                } else if (pagination.page >= pagination.totalPages - 2) {
                                                    pageNum = pagination.totalPages - 4 + i
                                                } else {
                                                    pageNum = pagination.page - 2 + i
                                                }
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        disabled={isLoading}
                                                        className={`w-10 h-10 rounded-lg font-medium text-sm transition-all disabled:opacity-50 ${pagination.page === pageNum
                                                            ? 'bg-[#8B1538] text-white'
                                                            : 'bg-white border border-[#EBEBEB] text-[#4A4A4A] hover:bg-[#F8F8F8]'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page === pagination.totalPages || isLoading}
                                            className="p-2 rounded-lg border border-[#EBEBEB] bg-white hover:bg-[#F8F8F8] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronRight className="h-5 w-5 text-[#4A4A4A]" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    )
}
