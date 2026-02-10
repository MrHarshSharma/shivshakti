
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Ticket,
    Plus,
    Trash2,
    Edit,
    ArrowLeft,
    Loader2,
    X,
    Calendar,
    CalendarClock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'
import { formatDate } from '@/utils/date'

interface Coupon {
    id: number
    code: string
    valid_from: string
    valid_till: string
    off_percent: string
    min_cost: string
    created_at: string
}

export default function CouponManagement() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<number | null>(null)

    // Form state
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        valid_from: '',
        valid_till: '',
        off_percent: '',
        min_cost: ''
    })

    const cancelEdit = () => {
        setEditingId(null)
        setNewCoupon({ code: '', valid_from: '', valid_till: '', off_percent: '', min_cost: '' })
        setError(null)
        setSuccess(null)
    }

    useEffect(() => {
        fetchCoupons()
    }, [])

    const fetchCoupons = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/coupons')
            const data = await response.json()
            if (data.success) {
                setCoupons(data.coupons || [])
            } else {
                setError(data.error || 'Failed to fetch coupons')
            }
        } catch (err) {
            console.error('Error fetching coupons:', err)
            setError('An error occurred while fetching coupons')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateOrUpdateCoupon = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)
        setSuccess(null)

        try {
            const url = '/api/coupons'
            const method = editingId ? 'PATCH' : 'POST'
            const body = editingId ? { ...newCoupon, id: editingId } : newCoupon

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            const data = await response.json()

            if (data.success) {
                setSuccess(`Coupon ${editingId ? 'updated' : 'created'} successfully!`)
                cancelEdit()
                fetchCoupons()
            } else {
                setError(data.error || `Failed to ${editingId ? 'update' : 'create'} coupon`)
            }
        } catch (err) {
            console.error(`Error ${editingId ? 'updating' : 'creating'} coupon:`, err)
            setError(`An error occurred while ${editingId ? 'updating' : 'creating'} the coupon`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditClick = (coupon: Coupon) => {
        setEditingId(coupon.id)
        setNewCoupon({
            code: coupon.code,
            valid_from: coupon.valid_from,
            valid_till: coupon.valid_till,
            off_percent: coupon.off_percent,
            min_cost: coupon.min_cost || ''
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const [deleteId, setDeleteId] = useState<number | null>(null)

    const confirmDelete = async () => {
        if (!deleteId) return

        try {
            const response = await fetch(`/api/coupons?id=${deleteId}`, {
                method: 'DELETE'
            })
            const data = await response.json()

            if (data.success) {
                setSuccess('Coupon deleted successfully!')
                fetchCoupons()
            } else {
                setError(data.error || 'Failed to delete coupon')
            }
        } catch (err) {
            console.error('Error deleting coupon:', err)
            setError('An error occurred while deleting the coupon')
        } finally {
            setDeleteId(null)
        }
    }

    const handleDeleteClick = (id: number) => {
        setDeleteId(id)
    }

    return (
        <div className="min-h-screen bg-[#FEFBF5] relative overflow-hidden pt-32 pb-16">
            {/* Background Patterns */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/20 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/p6.png')] opacity-10" />
            </div>

            <div className="container mx-auto px-4 max-w-5xl relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-orange-100 text-saffron hover:text-orange-600 text-xs font-bold uppercase tracking-wider mb-6 transition-all group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                    <h1 className="font-cinzel text-4xl sm:text-5xl text-[#2D1B1B] mb-2 font-bold tracking-tight">
                        Coupon <span className="text-saffron">Management</span>
                    </h1>
                    <p className="text-[#4A3737]/70 font-playfair text-lg">Create and oversee your promotional heritage treasures.</p>
                </div>

                {/* Global Feedback Messages */}
                {(error || success) && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 shadow-sm">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-2xl text-sm font-bold border border-green-100 shadow-sm">
                                <CheckCircle2 className="h-5 w-5 shrink-0" />
                                {success}
                            </div>
                        )}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`lg:col-span-1 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border ${editingId ? 'border-saffron/50' : 'border-white/50'} p-8 shadow-xl h-fit transition-colors duration-500`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-cinzel text-xl text-[#2D1B1B] flex items-center gap-2">
                                {editingId ? (
                                    <>
                                        <Edit className="h-5 w-5 text-saffron" />
                                        Edit Coupon
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-5 w-5 text-saffron" />
                                        New Coupon
                                    </>
                                )}
                            </h2>
                            {editingId && (
                                <button
                                    onClick={cancelEdit}
                                    className="p-2 text-[#4A3737]/40 hover:text-red-500 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleCreateOrUpdateCoupon} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#4A3737]/60 mb-2">Coupon Code</label>
                                <input
                                    required
                                    type="text"
                                    value={newCoupon.code}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                    placeholder="e.g. HERITAGE20"
                                    className="w-full px-4 py-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-saffron/20 focus:border-saffron outline-none transition-all font-bold placeholder:font-normal placeholder:opacity-30"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#4A3737]/60 mb-2">Discount %</label>
                                    <input
                                        required
                                        type="text"
                                        value={newCoupon.off_percent}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, off_percent: e.target.value })}
                                        placeholder="e.g. 20"
                                        className="w-full px-4 py-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-saffron/20 focus:border-saffron outline-none transition-all font-bold placeholder:font-normal placeholder:opacity-30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#4A3737]/60 mb-2">Min Spend (₹)</label>
                                    <input
                                        type="text"
                                        value={newCoupon.min_cost}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, min_cost: e.target.value })}
                                        placeholder="e.g. 500"
                                        className="w-full px-4 py-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-saffron/20 focus:border-saffron outline-none transition-all font-bold placeholder:font-normal placeholder:opacity-30"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#4A3737]/60 mb-2">Valid From</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-saffron opacity-50" />
                                        <input
                                            required
                                            type="date"
                                            value={newCoupon.valid_from}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, valid_from: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-saffron/20 focus:border-saffron outline-none transition-all font-playfair"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#4A3737]/60 mb-2">Valid Till</label>
                                    <div className="relative">
                                        <CalendarClock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-magenta opacity-50" />
                                        <input
                                            required
                                            type="date"
                                            value={newCoupon.valid_till}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, valid_till: e.target.value })}
                                            className="w-full pl-12 pr-4 py-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-saffron/20 focus:border-saffron outline-none transition-all font-playfair"
                                        />
                                    </div>
                                </div>
                            </div>



                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 ${editingId ? 'bg-saffron' : 'bg-[#2D1B1B]'} text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-lg hover:shadow-saffron/30 disabled:opacity-50 flex items-center justify-center gap-2`}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : editingId ? (
                                    'Update Coupon'
                                ) : (
                                    'Create Coupon'
                                )}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="w-full py-3 text-[#4A3737]/60 text-[10px] font-black uppercase tracking-widest hover:text-[#2D1B1B] transition-colors"
                                >
                                    Cancel Editing
                                </button>
                            )}
                        </form>
                    </motion.div>

                    {/* Coupons List */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-orange-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-orange-50">
                                        <Ticket className="h-6 w-6 text-saffron" />
                                    </div>
                                    <h2 className="font-cinzel text-2xl text-[#2D1B1B] font-bold">Active Coupons</h2>
                                </div>
                            </div>

                            <div className="p-6">
                                {isLoading ? (
                                    <div className="text-center py-20">
                                        <Loader2 className="h-10 w-10 animate-spin text-saffron mx-auto mb-4" />
                                        <p className="text-[#4A3737]/60 font-playfair italic">Searching the archives...</p>
                                    </div>
                                ) : coupons.length === 0 ? (
                                    <div className="text-center py-20 bg-orange-50/30 rounded-3xl">
                                        <Ticket className="h-16 w-16 text-[#4A3737]/10 mx-auto mb-4" />
                                        <p className="text-[#4A3737]/60 font-playfair text-lg">No treasures found.</p>
                                        <p className="text-[#4A3737]/40 text-sm">Start by creating your first promotional code.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-[#4A3737]/40 border-b border-orange-50/50">
                                                    <th className="text-left font-playfair text-[10px] font-bold uppercase tracking-[0.2em] pb-4">Code</th>
                                                    <th className="text-left font-playfair text-[10px] font-bold uppercase tracking-[0.2em] pb-4 px-4">Off %</th>
                                                    <th className="text-left font-playfair text-[10px] font-bold uppercase tracking-[0.2em] pb-4 px-4">Min Spend</th>
                                                    <th className="text-left font-playfair text-[10px] font-bold uppercase tracking-[0.2em] pb-4 px-4">Validity</th>
                                                    <th className="text-left font-playfair text-[10px] font-bold uppercase tracking-[0.2em] pb-4 px-4">Status</th>
                                                    <th className="text-right font-playfair text-[10px] font-bold uppercase tracking-[0.2em] pb-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-orange-50/30">
                                                {coupons.map((coupon, idx) => {
                                                    const today = new Date().toISOString().split('T')[0]
                                                    const isActive = today >= coupon.valid_from && today <= coupon.valid_till
                                                    const isExpired = today > coupon.valid_till
                                                    const isUpcoming = today < coupon.valid_from

                                                    return (
                                                        <motion.tr
                                                            key={coupon.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className="group hover:bg-orange-50/20 transition-all"
                                                        >
                                                            <td className="py-4">
                                                                <span className="font-cinzel font-bold text-lg text-[#2D1B1B] bg-saffron/5 px-3 py-1.5 rounded-lg border border-saffron/10">{coupon.code}</span>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <span className="font-bold text-magenta">{coupon.off_percent}% OFF</span>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <span className="text-[#4A3737]/60 font-playfair">₹{coupon.min_cost || '0'}</span>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="space-y-0.5">
                                                                    <p className="text-[10px] text-[#4A3737]/60 flex items-center gap-2">
                                                                        <span className="w-8">From:</span>
                                                                        <span className="font-bold text-[#2D1B1B]">{formatDate(coupon.valid_from)}</span>
                                                                    </p>
                                                                    <p className="text-[10px] text-[#4A3737]/60 flex items-center gap-2">
                                                                        <span className="w-8">Till:</span>
                                                                        <span className="font-bold text-magenta">{formatDate(coupon.valid_till)}</span>
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                {isActive ? (
                                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-100">
                                                                        <CheckCircle2 className="h-3 w-3" />
                                                                        Active
                                                                    </span>
                                                                ) : isUpcoming ? (
                                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-blue-100">
                                                                        <Calendar className="h-3 w-3" />
                                                                        Scheduled
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-100 opacity-60">
                                                                        <AlertCircle className="h-3 w-3" />
                                                                        Expired
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="py-4 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <button
                                                                        onClick={() => handleEditClick(coupon)}
                                                                        className="p-3 text-[#4A3737]/40 hover:text-saffron hover:bg-orange-50 rounded-xl transition-all"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteClick(coupon.id)}
                                                                        className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
                {/* Delete Confirmation Modal */}
                {deleteId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-orange-100"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="h-8 w-8 text-red-500" />
                                </div>
                                <h3 className="font-cinzel text-xl font-bold text-[#2D1B1B] mb-2">Delete Coupon?</h3>
                                <p className="text-[#4A3737]/60 text-sm mb-8">
                                    Are you sure you want to remove this coupon? This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeleteId(null)}
                                        className="flex-1 py-3 bg-gray-50 text-[#4A3737]/60 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}
