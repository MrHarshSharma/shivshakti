'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, ArrowLeft, Package, Clock, CheckCircle, XCircle } from 'lucide-react'
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

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/user/orders')
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="h-5 w-5 text-emerald-500" />
            case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />
            default: return <Clock className="h-5 w-5 text-yellow-500" />
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Delivered'
            case 'cancelled': return 'Cancelled'
            default: return 'In Transit / Pending'
        }
    }

    return (
        <div className="min-h-screen bg-[#FEFBF5] pt-32 pb-16">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-saffron hover:text-orange-600 text-sm font-bold uppercase tracking-wider mb-4 transition-colors">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Link>
                    <h1 className="font-cinzel text-5xl text-[#2D1B1B] mb-2 font-bold tracking-tight">
                        My <span className="text-saffron">Orders</span>
                    </h1>
                    <p className="text-[#4A3737]/70 font-playfair text-lg">Your history of luxury and heritage.</p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-saffron border-t-transparent" />
                        <p className="mt-4 font-playfair text-[#4A3737]/60 italic">Gathering your treasures...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-orange-100 shadow-xl">
                        <ShoppingBag className="h-20 w-20 text-[#4A3737]/10 mx-auto mb-6" />
                        <h2 className="font-cinzel text-2xl text-[#2D1B1B] mb-4">No Orders Yet</h2>
                        <p className="text-[#4A3737]/60 font-playfair mb-8">You haven't placed any orders with us yet.</p>
                        <Link href="/products" className="inline-flex px-8 py-4 bg-[#2D1B1B] text-white font-bold uppercase tracking-widest rounded-full hover:bg-black transition-all shadow-lg hover:shadow-gray-200">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order, idx) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-[0_12px_40px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-2xl transition-all duration-500 group"
                            >
                                {/* Order Header */}
                                <div className="p-8 border-b border-orange-50 bg-white/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-orange-50">
                                            <Package className="h-6 w-6 text-saffron" />
                                        </div>
                                        <div>
                                            <p className="font-playfair text-[10px] text-[#4A3737]/50 uppercase tracking-[0.2em] mb-0.5">Order ID</p>
                                            <h2 className="font-cinzel text-xl text-[#2D1B1B] font-bold">#{order.id}</h2>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6">
                                        <div>
                                            <p className="font-playfair text-[10px] text-[#4A3737]/50 uppercase tracking-[0.2em] mb-0.5 text-right">Date</p>
                                            <p className="font-playfair text-sm text-[#4A3737] font-medium">{formatDate(order.created_at)}</p>
                                        </div>
                                        <div>
                                            <p className="font-playfair text-[10px] text-[#4A3737]/50 uppercase tracking-[0.2em] mb-0.5 text-right">Total Amount</p>
                                            <p className="font-cinzel text-lg text-[#2D1B1B] font-bold">₹{order.order.total}</p>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-orange-100 shadow-sm">
                                            {getStatusIcon(order.status)}
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2D1B1B]">
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-8">
                                    <div className="space-y-6">
                                        {order.order.items.map((item, i) => (
                                            <div key={i} className="flex items-center gap-6">
                                                <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-orange-100 flex-shrink-0">
                                                    <Image
                                                        src={item.image || '/placeholder-product.png'}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="font-playfair text-lg text-[#2D1B1B] font-bold leading-tight mb-1">{item.name}</h3>
                                                    <p className="text-sm text-[#4A3737]/60 font-playfair italic">Quantity: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-cinzel font-bold text-[#2D1B1B]">₹{item.price * item.quantity}</p>
                                                    <p className="text-[10px] text-[#4A3737]/40 font-playfair">₹{item.price} each</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Footer (Summary) */}
                                <div className="px-8 py-6 bg-orange-50/30 flex justify-between items-center group-hover:bg-orange-50/50 transition-colors">
                                    <span className="font-playfair text-[#4A3737]/60 italic text-sm">
                                        {order.order.itemCount} {order.order.itemCount === 1 ? 'item' : 'items'} in this order
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-saffron">
                                        Payment: {order.payment_status}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
