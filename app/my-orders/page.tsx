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
                ) : orders.length === 0 ? (
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
                    <div className="space-y-6">
                        {orders.map((order, idx) => {
                            const theme = getStatusTheme(order.status)
                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-3xl shadow-[0_10px_30px_-5px_rgba(45,27,27,0.06)] border border-orange-50/50 overflow-hidden"
                                >
                                    {/* Compact Header */}
                                    <div className="px-6 py-4 flex items-center justify-between border-b border-orange-50/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center border border-orange-100/50">
                                                <Package className="h-4 w-4 text-saffron" />
                                            </div>
                                            <div>
                                                <h2 className="font-cinzel text-lg text-[#2D1B1B] font-black leading-none">#{order.id}</h2>
                                                <p className="text-[10px] font-black text-[#4A3737]/30 uppercase tracking-widest">{formatDate(order.created_at)}</p>
                                            </div>
                                        </div>
                                        <div className={`${theme.bg} ${theme.text} px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm`}>
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
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
