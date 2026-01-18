'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    ShoppingBag,
    Package,
    IndianRupee,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    Plus,
    Eye,
    Edit,
    Trash2
} from 'lucide-react'

interface DashboardStats {
    totalOrders: number
    pendingOrders: number
    totalRevenue: number
    totalProducts: number
}

interface Order {
    id: number
    name: string
    phone: string
    status: string
    payment_status: string
    order: {
        total: number
        itemCount: number
    }
    created_at: string
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        totalProducts: 0
    })
    const [recentOrders, setRecentOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            // Fetch orders
            const ordersResponse = await fetch('/api/orders/list')
            const ordersData = await ordersResponse.json()

            // Fetch products
            const productsResponse = await fetch('/api/products')
            const productsData = await productsResponse.json()

            if (ordersData.success) {
                const orders = ordersData.orders || []
                const totalRevenue = orders.reduce((sum: number, order: Order) => sum + (order.order?.total || 0), 0)
                const pendingOrders = orders.filter((order: Order) => order.status === 'pending').length

                setStats({
                    totalOrders: orders.length,
                    pendingOrders,
                    totalRevenue,
                    totalProducts: productsData.products?.length || 0
                })

                setRecentOrders(orders.slice(0, 5))
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const statCards = [
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: IndianRupee,
            color: 'bg-emerald-500',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: Clock,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        },
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        }
    ]

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            completed: 'bg-green-100 text-green-700 border-green-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200'
        }
        return styles[status as keyof typeof styles] || styles.pending
    }

    return (
        <div className="min-h-screen bg-[#FEFBF5] pt-32 pb-16">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-cinzel text-4xl text-[#2D1B1B] mb-2">Admin Dashboard</h1>
                    <p className="text-[#4A3737]/70 font-playfair">Manage your store and track performance</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                                </div>
                                <TrendingUp className="h-5 w-5 text-emerald-500" />
                            </div>
                            <h3 className="text-[#4A3737]/70 text-sm font-playfair mb-1">{stat.title}</h3>
                            <p className="text-3xl font-bold text-[#2D1B1B] font-cinzel">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Link href="/admin/add-product">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="bg-gradient-to-br from-saffron to-orange-600 rounded-2xl shadow-lg p-6 text-white cursor-pointer"
                        >
                            <Plus className="h-8 w-8 mb-3" />
                            <h3 className="font-cinzel text-xl font-bold mb-1">Add Product</h3>
                            <p className="text-white/80 text-sm">Add new products to catalog</p>
                        </motion.div>
                    </Link>

                    <Link href="/admin/orders">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white cursor-pointer"
                        >
                            <ShoppingBag className="h-8 w-8 mb-3" />
                            <h3 className="font-cinzel text-xl font-bold mb-1">View Orders</h3>
                            <p className="text-white/80 text-sm">Manage customer orders</p>
                        </motion.div>
                    </Link>

                    <Link href="/admin/products">
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white cursor-pointer"
                        >
                            <Package className="h-8 w-8 mb-3" />
                            <h3 className="font-cinzel text-xl font-bold mb-1">Manage Products</h3>
                            <p className="text-white/80 text-sm">Edit or delete products</p>
                        </motion.div>
                    </Link>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-cinzel text-2xl text-[#2D1B1B]">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-saffron hover:text-orange-600 text-sm font-bold uppercase tracking-wider">
                            View All →
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-saffron border-r-transparent"></div>
                            <p className="mt-4 text-[#4A3737]/70 font-playfair">Loading orders...</p>
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingBag className="h-16 w-16 text-[#4A3737]/30 mx-auto mb-4" />
                            <p className="text-[#4A3737]/70 font-playfair">No orders yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-orange-100">
                                        <th className="text-left py-3 px-4 font-playfair text-sm font-semibold text-[#2D1B1B]">Order ID</th>
                                        <th className="text-left py-3 px-4 font-playfair text-sm font-semibold text-[#2D1B1B]">Customer</th>
                                        <th className="text-left py-3 px-4 font-playfair text-sm font-semibold text-[#2D1B1B]">Items</th>
                                        <th className="text-left py-3 px-4 font-playfair text-sm font-semibold text-[#2D1B1B]">Total</th>
                                        <th className="text-left py-3 px-4 font-playfair text-sm font-semibold text-[#2D1B1B]">Status</th>
                                        <th className="text-left py-3 px-4 font-playfair text-sm font-semibold text-[#2D1B1B]">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-orange-50 hover:bg-orange-50/50 transition-colors">
                                            <td className="py-4 px-4 font-playfair text-sm text-[#2D1B1B] font-semibold">#{order.id}</td>
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-playfair text-sm text-[#2D1B1B] font-semibold">{order.name}</p>
                                                    <p className="font-playfair text-xs text-[#4A3737]/70">{order.phone}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 font-playfair text-sm text-[#4A3737]">{order.order?.itemCount || 0}</td>
                                            <td className="py-4 px-4 font-playfair text-sm text-[#2D1B1B] font-bold">₹{order.order?.total || 0}</td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 font-playfair text-sm text-[#4A3737]">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
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
