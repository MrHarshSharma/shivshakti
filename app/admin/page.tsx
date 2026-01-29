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
    Trash2,
    ArrowRight,
    ChevronDown,
    Loader2,
    Ticket
} from 'lucide-react'
import { formatDate } from '@/utils/date'

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

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        totalProducts: 0
    })
    const [recentOrders, setRecentOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const ordersResponse = await fetch('/api/orders/list')
            const ordersData = await ordersResponse.json()

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
                await fetchDashboardData()
            }
        } catch (error) {
            console.error('Error updating order status:', error)
        } finally {
            setUpdatingOrderId(null)
        }
    }

    const statCards = [
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: IndianRupee,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-500/10',
            accent: 'emerald',
            trend: '+12.5%'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingBag,
            color: 'text-blue-600',
            bgColor: 'bg-blue-500/10',
            accent: 'blue',
            trend: '+8.2%'
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders,
            icon: Clock,
            color: 'text-orange-600',
            bgColor: 'bg-orange-500/10',
            accent: 'orange',
            trend: 'Needs Attention'
        },
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: Package,
            color: 'text-purple-600',
            bgColor: 'bg-purple-500/10',
            accent: 'purple',
            trend: 'Inventory'
        }
    ]

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100/80 text-yellow-700 border-yellow-200 backdrop-blur-sm',
            completed: 'bg-green-100/80 text-green-700 border-green-200 backdrop-blur-sm',
            cancelled: 'bg-red-100/80 text-red-700 border-red-200 backdrop-blur-sm'
        }
        return styles[status as keyof typeof styles] || styles.pending
    }

    return (
        <div className="min-h-screen bg-[#FEFBF5] relative overflow-hidden pt-32 pb-16">
            {/* Immersive Background Patterns */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/20 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-magenta/10 rounded-full blur-[100px] -ml-64 -mb-64 animate-pulse animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/p6.png')] opacity-10" />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 backdrop-blur-md rounded-full border border-orange-100 mb-4"
                        >
                            <TrendingUp className="h-4 w-4 text-saffron" />
                            <span className="text-[#4A3737] text-[10px] font-bold uppercase tracking-[0.2em]">Management Suite</span>
                        </motion.div>
                        <h1 className="font-cinzel text-4xl sm:text-5xl text-[#2D1B1B] mb-2 font-bold tracking-tight">
                            Admin <span className="text-saffron">Overview</span>
                        </h1>
                        <p className="text-[#4A3737]/70 font-playfair text-lg">Your master control for the Shivshakti catalog and orders.</p>
                    </div>
                </div>

                {/* Stats Grid - Glassmorphism */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/40 p-8 shadow-[0_8px_32px_rgba(217,119,6,0.05)] hover:shadow-[0_20px_48px_rgba(217,119,6,0.12)] transition-all duration-500"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className={`${stat.bgColor} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.accent === 'orange' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-[#4A3737]/60 text-xs font-bold uppercase tracking-widest mb-1 font-playfair">{stat.title}</h3>
                            <p className="text-3xl font-bold text-[#2D1B1B] font-cinzel tracking-tight">{stat.value}</p>

                            {/* Decorative line */}
                            <div className={`absolute bottom-0 left-8 right-8 h-1 rounded-t-full transition-all duration-500 opacity-0 group-hover:opacity-100 ${stat.accent === 'emerald' ? 'bg-emerald-400' :
                                stat.accent === 'blue' ? 'bg-blue-400' :
                                    stat.accent === 'orange' ? 'bg-orange-400' : 'bg-purple-400'
                                }`} />
                        </motion.div>
                    ))}
                </div>

                {/* Command Center - Premium Action Tiles */}
                <h2 className="font-cinzel text-xl text-[#2D1B1B] mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-saffron" />
                    Command Center
                    <span className="w-8 h-px bg-saffron" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <Link href="/admin/add-product">
                        <motion.div
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="relative h-48 bg-gradient-to-br from-saffron via-orange-500 to-orange-600 rounded-[2.5rem] shadow-xl overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white/30 rounded-full -ml-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative h-full p-7 flex flex-col justify-between text-white">
                                <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <Plus className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-cinzel text-2xl font-bold mb-1 text-[#2D1B1B]">Add Product</h3>
                                    <p className="text-white/80 text-sm font-playfair">Grow your digital orchard</p>
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    <Link href="/admin/orders">
                        <motion.div
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="relative h-48 bg-gradient-to-br from-magenta via-pink-600 to-rose-700 rounded-[2.5rem] shadow-xl overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white/30 rounded-full -ml-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative h-full p-7 flex flex-col justify-between text-white">
                                <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <ShoppingBag className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-cinzel text-2xl font-bold mb-1 text-[#2D1B1B]">View Orders</h3>
                                    <p className="text-white/80 text-sm font-playfair">Manage customer joy</p>
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    <Link href="/admin/products">
                        <motion.div
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="relative h-48 bg-gradient-to-br from-indigo-300 via-purple-600 to-fuchsia-700 rounded-[2.5rem] shadow-xl overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white/30 rounded-full -ml-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative h-full p-7 flex flex-col justify-between text-white">
                                <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <Package className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-cinzel text-2xl font-bold mb-1 text-[#2D1B1B]">Manage Products</h3>
                                    <p className="text-white/80 text-sm font-playfair">Orchestrate the collection</p>
                                </div>
                            </div>
                        </motion.div>
                    </Link>

                    <Link href="/admin/coupons">
                        <motion.div
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="relative h-48 bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 rounded-[2.5rem] shadow-xl overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white/30 rounded-full -ml-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative h-full p-7 flex flex-col justify-between text-white">
                                <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <Ticket className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-cinzel text-2xl font-bold mb-1 text-[#2D1B1B]">Manage Coupons</h3>
                                    <p className="text-white/80 text-sm font-playfair">Promotional treasures</p>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </div>

                {/* Recent Orders - Refined Table */}
                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-[0_12px_40px_rgba(0,0,0,0.03)] overflow-hidden">
                    <div className="p-8 border-b border-orange-50 flex items-center justify-between bg-white/40">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-orange-50">
                                <Clock className="h-6 w-6 text-saffron" />
                            </div>
                            <div>
                                <h2 className="font-cinzel text-2xl text-[#2D1B1B] font-bold">Recent Orders</h2>
                                <p className="text-[#4A3737]/60 text-xs font-playfair uppercase tracking-widest">Latest transactions</p>
                            </div>
                        </div>
                        <Link href="/admin/orders" className="group flex items-center gap-2 px-6 py-3 bg-[#2D1B1B] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-saffron transition-all duration-300 shadow-lg hover:shadow-saffron/40">
                            View All
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="p-4">
                        {isLoading ? (
                            <div className="text-center py-24">
                                <div className="inline-block h-12 w-12 animate-spin rounded-full border-[3px] border-solid border-saffron border-r-transparent shadow-sm"></div>
                                <p className="mt-6 text-[#4A3737]/60 font-playfair italic">Whispering to the database...</p>
                            </div>
                        ) : recentOrders.length === 0 ? (
                            <div className="text-center py-24 bg-orange-50/30 rounded-3xl m-4">
                                <ShoppingBag className="h-20 w-20 text-[#4A3737]/10 mx-auto mb-6" />
                                <p className="text-[#4A3737]/60 font-playfair text-xl">The store awaits its first guest.</p>
                                <p className="text-[#4A3737]/40 text-sm mt-2">No orders have been placed yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-[#4A3737]/40">
                                            <th className="text-left py-6 px-6 font-playfair text-[10px] font-bold uppercase tracking-[0.2em]">Order ID</th>
                                            <th className="text-left py-6 px-6 font-playfair text-[10px] font-bold uppercase tracking-[0.2em]">Customer</th>
                                            <th className="text-left py-6 px-6 font-playfair text-[10px] font-bold uppercase tracking-[0.2em]">Product Name</th>
                                            <th className="text-left py-6 px-6 font-playfair text-[10px] font-bold uppercase tracking-[0.2em]">Qty</th>
                                            <th className="text-left py-6 px-6 font-playfair text-[10px] font-bold uppercase tracking-[0.2em]">Date</th>
                                            <th className="text-left py-6 px-6 font-playfair text-[10px] font-bold uppercase tracking-[0.2em]">Total</th>
                                            <th className="text-left py-6 px-6 font-playfair text-[10px] font-bold uppercase tracking-[0.2em]">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-orange-50/50">
                                        {recentOrders.map((order, idx) => (
                                            <motion.tr
                                                key={order.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="group hover:bg-orange-50/30 transition-colors"
                                            >
                                                <td className="py-6 px-6 font-playfair text-sm text-[#2D1B1B] font-bold">
                                                    <span className="text-saffron">#</span>{order.id}
                                                </td>
                                                <td className="py-6 px-6">
                                                    <div>
                                                        <p className="font-playfair text-sm text-[#2D1B1B] font-bold group-hover:text-magenta transition-colors">{order.name}</p>
                                                        <p className="font-playfair text-[10px] text-[#4A3737]/50 tracking-wider ">{order.phone}</p>
                                                    </div>
                                                </td>
                                                <td className="py-6 px-6">
                                                    {order.order?.items && order.order.items.length > 0 ? (
                                                        <div className="flex flex-col gap-1.5">
                                                            {order.order.items.slice(0, 2).map((item, i) => (
                                                                <div key={i} className="flex items-center gap-2">
                                                                    <span className="text-[10px] bg-orange-100 text-saffron px-1.5 py-0.5 rounded-md font-bold">
                                                                        x{item.quantity}
                                                                    </span>
                                                                    <span className="font-playfair text-sm text-[#2D1B1B] font-bold leading-tight">
                                                                        {item.name}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                            {order.order.items.length > 2 && (
                                                                <span className="text-[10px] text-saffron font-bold uppercase tracking-widest mt-0.5">
                                                                    + {order.order.items.length - 2} more varieties
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="italic text-[#4A3737]/40 leading-tight text-xs">No items found</span>
                                                    )}
                                                </td>
                                                <td className="py-6 px-6">
                                                    <div className="w-10 h-10 rounded-xl bg-white border border-orange-100 flex items-center justify-center font-cinzel font-bold text-sm shadow-sm text-saffron relative group/qty">
                                                        {order.order?.itemCount || 0}
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-saffron rounded-full animate-pulse opacity-0 group-hover/qty:opacity-100 transition-opacity" />
                                                    </div>
                                                </td>
                                                <td className="py-6 px-6 font-playfair text-xs text-[#4A3737]/60 italic">
                                                    {formatDate(order.created_at)}
                                                </td>
                                                <td className="py-6 px-6 font-cinzel text-sm text-[#2D1B1B] font-bold">₹{order.order?.total || 0}</td>
                                                <td className="py-6 px-6">
                                                    <div className="relative inline-flex items-center group">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                            disabled={updatingOrderId === order.id}
                                                            className={`pr-8 pl-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer appearance-none ${getStatusBadge(order.status).replace('text-yellow-700', 'text-yellow-700')} focus:outline-none focus:ring-2 focus:ring-saffron/20 shadow-sm hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
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
        </div>
    )
}
