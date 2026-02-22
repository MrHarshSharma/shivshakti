'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowLeft, Package, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'
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
                // Refresh current page after cancellation
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
                label: 'completed',
                lightBg: 'bg-emerald-50',
                icon: <CheckCircle className="h-3 w-3" />
            }
            case 'cancelled': return {
                bg: 'bg-red-500',
                text: 'text-white',
                label: 'Cancelled',
                lightBg: 'bg-red-50',
                icon: <XCircle className="h-3 w-3" />
            }
            default: return {
                bg: 'bg-amber-500',
                text: 'text-white',
                label: 'Order Placed',
                lightBg: 'bg-amber-50',
                icon: <Clock className="h-3 w-3" />
            }
        }
    }

    // Calculate display range
    const startIndex = (pagination.page - 1) * pagination.limit + 1
    const endIndex = Math.min(pagination.page * pagination.limit, pagination.total)

    return (
        <div className="min-h-screen bg-[#FEFBF5] pt-32 pb-24 relative overflow-hidden">
            {/* Soft Ambient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-orange-50/30 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                {/* Specific Back Button Design */}
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 text-[#4A3737]/60 hover:text-saffron transition-all duration-300 group"
                    >
                        <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-bold uppercase tracking-[0.2em]">Back to Collection</span>
                    </Link>
                </div>

                {/* Professional Centered Header */}
                <div className="mb-20 text-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block mb-4"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-saffron opacity-60">Personal Archive</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-cinzel text-[#2D1B1B] mb-6 font-bold"
                    >
                        My <span className="text-saffron">Orders</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[#4A3737]/60 font-playfair text-lg md:text-xl max-w-xl mx-auto italic"
                    >
                        Explore your curated history of heritage artifacts and luxury treasures.
                    </motion.p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-10 h-10 border-t-2 border-saffron rounded-full"
                        />
                    </div>
                ) : pagination.total === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-3xl p-10 text-center shadow-sm border border-orange-100/30"
                    >
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="h-8 w-8 text-saffron/20" />
                        </div>
                        <h2 className="font-cinzel text-xl text-[#2D1B1B] font-black mb-1">No Orders</h2>
                        <p className="font-playfair text-[#4A3737]/40 italic mb-8 text-sm text-balance px-4">Your heritage collection awaits its first entry.</p>
                        <Link href="/products" className="inline-block px-8 py-3 bg-[#2D1B1B] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-saffron transition-all duration-300">
                            Shop Now
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {orders.map((order, idx) => {
                                const theme = getStatusTheme(order.status)
                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="bg-white rounded-3xl shadow-[0_10px_30px_-5px_rgba(45,27,27,0.06)] border border-orange-50/50 overflow-hidden"
                                    >
                                        {/* Compact Header */}
                                        <div className="px-6 py-4 flex flex-row items-start justify-between border-b border-orange-50/30 gap-4">
                                            <div className="flex items-start gap-3 min-w-0">
                                                <div className="w-10 h-10 md:w-8 md:h-8 bg-orange-50 rounded-lg flex items-center justify-center border border-orange-100/50 shrink-0 mt-0.5 md:mt-0">
                                                    <Package className="h-5 w-5 md:h-4 md:w-4 text-saffron" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h2 className="font-cinzel text-lg text-[#2D1B1B] font-black leading-none truncate pr-2">#{order.id}</h2>
                                                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                        <p className="text-[10px] font-black text-[#4A3737]/30 uppercase tracking-widest whitespace-nowrap">{formatDate(order.created_at)}</p>
                                                        {order.payment_status === 'store payment' && (
                                                            <>
                                                                <span className="text-[10px] text-[#4A3737]/20 font-black hidden xs:inline">•</span>
                                                                <span className="text-[8px] font-black uppercase tracking-widest text-[#2D1B1B] bg-orange-100/50 px-1.5 py-0.5 rounded border border-orange-100 whitespace-nowrap">
                                                                    Pickup
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`${theme.bg} ${theme.text} px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0`}>
                                                {theme.icon}
                                                {theme.label}
                                            </div>
                                        </div>

                                        {/* Concise Items List */}
                                        <div className="p-6 space-y-4">
                                            {order.order.items.map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 group">
                                                    <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-orange-50 flex-shrink-0 bg-orange-50/20">
                                                        <Image
                                                            src={item.image || '/placeholder-product.png'}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <h3 className="font-playfair text-base text-[#2D1B1B] font-black truncate leading-tight mb-1">{item.name}</h3>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] font-black text-[#4A3737]/40 uppercase tracking-widest">Qty: {item.quantity}</span>
                                                            <span className="text-[9px] font-black text-[#4A3737]/20 uppercase">•</span>
                                                            <span className="text-[9px] font-black text-[#4A3737]/40 uppercase tracking-widest">₹{item.price}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-cinzel font-black text-[#2D1B1B] text-sm">₹{item.price * item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Footer Actions */}
                                        {order.status === 'pending' && (
                                            <div className="px-6 py-4 bg-orange-50/20 border-t border-orange-50/30 flex justify-end">
                                                <button
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    disabled={cancellingId === order.id}
                                                    className="px-6 py-2 rounded-xl border border-red-200 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 shadow-sm"
                                                >
                                                    {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Pagination Controls */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-orange-100 shadow-sm">
                                <p className="text-sm text-[#4A3737]/60 font-playfair">
                                    Showing <span className="font-bold text-[#2D1B1B]">{startIndex}</span> to{' '}
                                    <span className="font-bold text-[#2D1B1B]">{endIndex}</span> of{' '}
                                    <span className="font-bold text-[#2D1B1B]">{pagination.total}</span> orders
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1 || isLoading}
                                        className="p-2 rounded-lg border border-orange-200 hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft className="h-5 w-5 text-[#4A3737]" />
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
                                                    className={`w-10 h-10 rounded-lg font-bold text-sm transition-all disabled:opacity-50 ${
                                                        pagination.page === pageNum
                                                            ? 'bg-saffron text-white shadow-lg'
                                                            : 'border border-orange-200 text-[#4A3737] hover:bg-orange-50'
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
                                        className="p-2 rounded-lg border border-orange-200 hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight className="h-5 w-5 text-[#4A3737]" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
