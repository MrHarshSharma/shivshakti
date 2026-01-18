'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, Filter, Download } from 'lucide-react'

interface Order {
    id: number
    name: string
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

    const updateOrderStatus = async (orderId: number, newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            })

            if (response.ok) {
                fetchOrders()
            }
        } catch (error) {
            console.error('Error updating order status:', error)
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
                    <h1 className="font-cinzel text-4xl text-[#2D1B1B] mb-2">Orders Management</h1>
                    <p className="text-[#4A3737]/70 font-playfair">View and manage all customer orders</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#4A3737]/40" />
                            <input
                                type="text"
                                placeholder="Search by name, phone, or order ID..."
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

                {/* Orders Table */}
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
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
                                        <th className="text-left py-4 px-6 font-playfair text-sm font-semibold text-[#2D1B1B]">Items</th>
                                        <th className="text-left py-4 px-6 font-playfair text-sm font-semibold text-[#2D1B1B]">Total</th>
                                        <th className="text-left py-4 px-6 font-playfair text-sm font-semibold text-[#2D1B1B]">Payment</th>
                                        <th className="text-left py-4 px-6 font-playfair text-sm font-semibold text-[#2D1B1B]">Status</th>
                                        <th className="text-left py-4 px-6 font-playfair text-sm font-semibold text-[#2D1B1B]">Date</th>
                                        <th className="text-left py-4 px-6 font-playfair text-sm font-semibold text-[#2D1B1B]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <motion.tr
                                            key={order.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-b border-orange-50 hover:bg-orange-50/50 transition-colors"
                                        >
                                            <td className="py-4 px-6 font-playfair text-sm text-[#2D1B1B] font-semibold">#{order.id}</td>
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className="font-playfair text-sm text-[#2D1B1B] font-semibold">{order.name}</p>
                                                    <p className="font-playfair text-xs text-[#4A3737]/70">{order.phone}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-playfair text-sm text-[#4A3737]">{order.order?.itemCount || 0}</td>
                                            <td className="py-4 px-6 font-playfair text-sm text-[#2D1B1B] font-bold">₹{order.order?.total || 0}</td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-green-100 text-green-700 border-green-200">
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(order.status)} appearance-none cursor-pointer`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-6 font-playfair text-sm text-[#4A3737]">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="text-saffron hover:text-orange-600 text-sm font-bold"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className="mt-6 bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
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
            </div>
        </div>
    )
}
