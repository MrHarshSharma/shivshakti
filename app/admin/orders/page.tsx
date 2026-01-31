'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, Filter, Download, ArrowRight, Clock, ChevronDown, Loader2 } from 'lucide-react'
import { formatDate } from '@/utils/date'

interface Order {
    id: number
    name: string
    email?: string
    phone: string
    address: string
    status: string
    payment_status: string
    razorpay_order_id: string
    razorpay_payment_id: string
    order: {
        total: number
        itemCount: number
        items: Array<{
            id: string
            name: string
            price: number
            quantity: number
            category: string
        }>
    }
    created_at: string
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null)

    useEffect(() => {
        fetchOrders()
    }, [])

    useEffect(() => {
        filterOrders()
    }, [searchTerm, statusFilter, orders])

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders/list')
            const data = await response.json()

            if (data.success) {
                setOrders(data.orders || [])
            }
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filterOrders = () => {
        let filtered = orders

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.email && order.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                order.phone.includes(searchTerm) ||
                order.id.toString().includes(searchTerm)
            )
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter)
        }

        setFilteredOrders(filtered)
    }

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            completed: 'bg-green-100 text-green-700 border-green-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200'
        }
        return styles[status as keyof typeof styles] || styles.pending
    }

    const getPaymentStatusBadge = (status: string) => {
        const s = status?.toLowerCase() || ''
        if (s === 'store payment') {
            return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }
        return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    }

    const updateOrderStatus = async (orderId: number, newStatus: string) => {
        setUpdatingOrderId(orderId)
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            })

            if (response.ok) {
                await fetchOrders()
            }
        } catch (error) {
            console.error('Error updating order status:', error)
        } finally {
            setUpdatingOrderId(null)
        }
    }

    return (
        <div className="min-h-screen bg-[#FEFBF5] relative overflow-hidden pt-32 pb-16">
            {/* Background Patterns */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/20 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-magenta/10 rounded-full blur-[100px] -ml-64 -mb-64 animate-pulse" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/admin" className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-orange-100 text-saffron hover:text-orange-600 text-xs font-bold uppercase tracking-wider mb-6 transition-all">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Link>
                    <h1 className="font-cinzel text-5xl text-[#2D1B1B] mb-2 font-bold">Orders <span className="text-saffron">Management</span></h1>
                    <p className="text-[#4A3737]/70 font-playfair text-lg">Orchestrate customer joy and commerce.</p>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-[#4A3737]/70 text-sm font-playfair mb-1">Total Orders</p>
                            <p className="text-2xl font-bold text-[#2D1B1B] font-cinzel">{filteredOrders.length}</p>
                        </div>
                        <div>
                            <p className="text-[#4A3737]/70 text-sm font-playfair mb-1">Total Revenue</p>
                            <p className="text-2xl font-bold text-[#2D1B1B] font-cinzel">
                                ₹{filteredOrders.reduce((sum, order) => sum + (order.order?.total || 0), 0).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-[#4A3737]/70 text-sm font-playfair mb-1">Average Order Value</p>
                            <p className="text-2xl font-bold text-[#2D1B1B] font-cinzel">
                                ₹{filteredOrders.length > 0 ? Math.round(filteredOrders.reduce((sum, order) => sum + (order.order?.total || 0), 0) / filteredOrders.length) : 0}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters - Glassmorphism */}
                <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/40 p-8 shadow-xl mb-8 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4A3737]/40" />
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, or order ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4A3737]/40" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white appearance-none"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Export */}
                        <button className="px-6 py-3 bg-saffron text-white rounded-lg hover:bg-orange-600 transition-colors font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                            <Download className="h-5 w-5" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Orders Table - Glassmorphism */}
                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-2xl overflow-hidden mb-8">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-saffron border-r-transparent"></div>
                            <p className="mt-4 text-[#4A3737]/70 font-playfair">Loading orders...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-[#4A3737]/70 font-playfair">No orders found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-orange-50">
                                    <tr>
                                        <th className="text-left py-4 px-6 font-playfair text-sm font-semibold text-[#2D1B1B]">Order ID</th>
                                        <th className="text-left py-4 px-6 font-playfair text-sm font-semibold text-[#2D1B1B]">Customer</th>
                                        <th className="text-left py-4 px-6 font-playfair text-sm font-semibold text-[#2D1B1B]">Product Name</th>
                                        <th className="text-left py-4 px-6 font-playfair text-sm font-semibold text-[#2D1B1B]">Quantity</th>
                                        <th className="text-left py-4 px-6 font-playfair text-sm font-semibold text-[#2D1B1B]">Total</th>
                                        <th className="text-left py-4 px-6 font-playfair text-sm font-semibold text-[#2D1B1B]">Date</th>
                                        <th className="text-left py-4 px-6 font-playfair text-sm font-semibold text-[#2D1B1B]">Payment</th>
                                        <th className="text-left py-4 px-6 font-playfair text-sm font-semibold text-[#2D1B1B]">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order, idx) => (
                                        <motion.tr
                                            key={order.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="border-b border-orange-50/50 hover:bg-orange-50/30 transition-colors group"
                                        >
                                            <td className="py-6 px-6 font-playfair text-sm text-[#2D1B1B] font-bold">
                                                <span className="text-saffron">#</span>{order.id}
                                            </td>
                                            <td className="py-6 px-6 text-[#2D1B1B]">
                                                <div>
                                                    <p className="font-playfair text-sm font-bold group-hover:text-magenta transition-colors">{order.name}</p>
                                                    {order.email && <p className="font-playfair text-[10px] text-[#4A3737]/50 tracking-wider ">{order.email}</p>}
                                                    <p className="font-playfair text-[10px] text-[#4A3737]/50 tracking-wider ">{order.phone}</p>
                                                </div>
                                            </td>
                                            <td className="py-6 px-6">
                                                {order.order?.items && order.order.items.length > 0 ? (
                                                    <div className="flex flex-col gap-1.5">
                                                        {order.order.items.slice(0, 3).map((item, i) => (
                                                            <div key={i} className="flex items-center gap-2">
                                                                <span className="text-[10px] bg-orange-100 text-saffron px-1.5 py-0.5 rounded-md font-bold">
                                                                    x{item.quantity}
                                                                </span>
                                                                <span className="font-playfair text-sm text-[#2D1B1B] font-bold leading-tight">
                                                                    {item.name}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {order.order.items.length > 3 && (
                                                            <span className="text-[10px] text-saffron font-bold uppercase tracking-widest mt-0.5">
                                                                + {order.order.items.length - 3} more varieties
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="italic text-[#4A3737]/40 leading-tight text-xs">No items found</span>
                                                )}
                                            </td>
                                            <td className="py-6 px-6 text-[#2D1B1B]">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center font-cinzel font-bold text-sm shadow-sm text-saffron">
                                                    {order.order?.itemCount || 0}
                                                </div>
                                            </td>

                                            <td className="py-6 px-6 font-cinzel text-sm text-[#2D1B1B] font-bold">₹{order.order?.total || 0}</td>
                                            <td className="py-6 px-6 font-playfair text-xs text-[#4A3737]/60 italic font-medium">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="py-6 px-6">
                                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm backdrop-blur-sm ${getPaymentStatusBadge(order.payment_status)}`}>
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="py-6 px-6">
                                                <div className="relative inline-flex items-center group">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        disabled={updatingOrderId === order.id}
                                                        className={`pr-8 pl-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer appearance-none ${getStatusBadge(order.status)} focus:outline-none focus:ring-2 focus:ring-saffron/20 shadow-sm hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                    <div className="absolute right-3 pointer-events-none">
                                                        {updatingOrderId === order.id ? (
                                                            <Loader2 className="h-3 w-3 animate-spin text-current" />
                                                        ) : (
                                                            <ChevronDown className="h-3 w-3 text-current opacity-50 group-hover:opacity-100 transition-opacity" />
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>


            </div>
        </div>
    )
}
