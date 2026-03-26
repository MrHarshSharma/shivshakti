'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Tag,
    Plus,
    Trash2,
    Edit,
    ArrowLeft,
    Loader2,
    X,
    CheckCircle2,
    AlertCircle,
    GripVertical
} from 'lucide-react'

interface Category {
    id: number
    category: string
    position?: number
}

export default function CategoryManagement() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Form state for creating new category
    const [newCategoryName, setNewCategoryName] = useState('')

    // Edit modal state
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [editCategoryName, setEditCategoryName] = useState('')
    const [isEditSubmitting, setIsEditSubmitting] = useState(false)

    // Drag and drop state
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
    const [isSavingOrder, setIsSavingOrder] = useState(false)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/categories')
            const data = await response.json()
            if (data.success) {
                setCategories(data.categories || [])
            } else {
                setError(data.error || 'Failed to fetch categories')
            }
        } catch (err) {
            console.error('Error fetching categories:', err)
            setError('An error occurred while fetching categories')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)
        setSuccess(null)

        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category: newCategoryName })
            })
            const data = await response.json()

            if (data.success) {
                setSuccess('Category created successfully!')
                setNewCategoryName('')
                fetchCategories()
            } else {
                setError(data.error || 'Failed to create category')
            }
        } catch (err) {
            console.error('Error creating category:', err)
            setError('An error occurred while creating the category')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEditClick = (category: Category) => {
        setEditingCategory(category)
        setEditCategoryName(category.category)
    }

    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingCategory) return

        setIsEditSubmitting(true)
        setError(null)
        setSuccess(null)

        try {
            const response = await fetch('/api/categories', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingCategory.id, category: editCategoryName })
            })
            const data = await response.json()

            if (data.success) {
                setSuccess('Category updated successfully!')
                setEditingCategory(null)
                setEditCategoryName('')
                fetchCategories()
            } else {
                setError(data.error || 'Failed to update category')
            }
        } catch (err) {
            console.error('Error updating category:', err)
            setError('An error occurred while updating the category')
        } finally {
            setIsEditSubmitting(false)
        }
    }

    const confirmDelete = async () => {
        if (!deleteId) return

        setIsDeleting(true)
        try {
            const response = await fetch(`/api/categories?id=${deleteId}`, {
                method: 'DELETE'
            })
            const data = await response.json()

            if (data.success) {
                setSuccess('Category deleted successfully!')
                fetchCategories()
            } else {
                setError(data.error || 'Failed to delete category')
            }
        } catch (err) {
            console.error('Error deleting category:', err)
            setError('An error occurred while deleting the category')
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    const handleDeleteClick = (id: number) => {
        setDeleteId(id)
    }

    // Drag and drop handlers
    const handleDragStart = (index: number) => {
        setDraggedIndex(index)
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        setDragOverIndex(index)
    }

    const handleDragEnd = async () => {
        if (draggedIndex === null || dragOverIndex === null || draggedIndex === dragOverIndex) {
            setDraggedIndex(null)
            setDragOverIndex(null)
            return
        }

        // Reorder categories locally
        const newCategories = [...categories]
        const [draggedItem] = newCategories.splice(draggedIndex, 1)
        newCategories.splice(dragOverIndex, 0, draggedItem)
        setCategories(newCategories)

        setDraggedIndex(null)
        setDragOverIndex(null)

        // Save order to database
        setIsSavingOrder(true)
        try {
            const response = await fetch('/api/categories', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categories: newCategories })
            })
            const data = await response.json()

            if (data.success) {
                setSuccess('Order saved!')
                setTimeout(() => setSuccess(null), 2000)
            } else {
                setError(data.error || 'Failed to save order')
                fetchCategories() // Revert on error
            }
        } catch (err) {
            console.error('Error saving order:', err)
            setError('An error occurred while saving the order')
            fetchCategories() // Revert on error
        } finally {
            setIsSavingOrder(false)
        }
    }

    const handleDragLeave = () => {
        setDragOverIndex(null)
    }

    return (
        <div className="min-h-screen bg-[#FEFBF5] relative overflow-hidden pt-32 pb-16">
            {/* Background Patterns */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/20 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/p6.png')] opacity-10" />
            </div>

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
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
                        Category <span className="text-saffron">Management</span>
                    </h1>
                    <p className="text-[#4A3737]/70 font-playfair text-lg">Organize your products with categories.</p>
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
                    {/* Form Section - Only for creating new categories */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/50 p-8 shadow-xl h-fit"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-cinzel text-xl text-[#2D1B1B] flex items-center gap-2">
                                <Plus className="h-5 w-5 text-saffron" />
                                New Category
                            </h2>
                        </div>

                        <form onSubmit={handleCreateCategory} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#4A3737]/60 mb-2">Category Name</label>
                                <input
                                    required
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="e.g. Gourmet, Hampers"
                                    className="w-full px-4 py-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-saffron/20 focus:border-saffron outline-none transition-all font-bold placeholder:font-normal placeholder:opacity-30"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-[#2D1B1B] text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-lg hover:shadow-saffron/30 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Create Category'
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Categories List */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-orange-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-orange-50">
                                        <Tag className="h-6 w-6 text-saffron" />
                                    </div>
                                    <div>
                                        <h2 className="font-cinzel text-2xl text-[#2D1B1B] font-bold">All Categories</h2>
                                        <p className="text-[#4A3737]/50 text-sm">
                                            {categories.length} categories
                                            {isSavingOrder && <span className="ml-2 text-saffron">• Saving...</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {isLoading ? (
                                    <div className="text-center py-20">
                                        <Loader2 className="h-10 w-10 animate-spin text-saffron mx-auto mb-4" />
                                        <p className="text-[#4A3737]/60 font-playfair italic">Loading categories...</p>
                                    </div>
                                ) : categories.length === 0 ? (
                                    <div className="text-center py-20 bg-orange-50/30 rounded-3xl">
                                        <Tag className="h-16 w-16 text-[#4A3737]/10 mx-auto mb-4" />
                                        <p className="text-[#4A3737]/60 font-playfair text-lg">No categories found.</p>
                                        <p className="text-[#4A3737]/40 text-sm">Start by creating your first category.</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A3737]/40 mb-3 flex items-center gap-2">
                                            <GripVertical className="h-3 w-3" />
                                            Drag to reorder
                                        </p>
                                        <div className="flex flex-col gap-3">
                                            {categories.map((category, idx) => (
                                                <div
                                                    key={category.id}
                                                    draggable
                                                    onDragStart={() => handleDragStart(idx)}
                                                    onDragOver={(e) => handleDragOver(e, idx)}
                                                    onDragEnd={handleDragEnd}
                                                    onDragLeave={handleDragLeave}
                                                    className={`group flex items-center justify-between p-4 bg-white rounded-2xl border transition-all cursor-move ${
                                                        draggedIndex === idx
                                                            ? 'opacity-50 border-saffron scale-[0.98]'
                                                            : dragOverIndex === idx
                                                            ? 'border-saffron border-2 shadow-lg'
                                                            : 'border-orange-50 hover:border-saffron/30 hover:shadow-lg'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-[#4A3737]/30 hover:text-saffron transition-colors">
                                                            <GripVertical className="h-5 w-5" />
                                                        </div>
                                                        <div className="w-10 h-10 bg-saffron/10 rounded-xl flex items-center justify-center">
                                                            <Tag className="h-5 w-5 text-saffron" />
                                                        </div>
                                                        <span className="font-playfair font-bold text-[#2D1B1B]">
                                                            {category.category}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => handleEditClick(category)}
                                                            className="p-2 text-[#4A3737]/40 hover:text-saffron hover:bg-orange-50 rounded-xl transition-all"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(category.id)}
                                                            className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Edit Category Modal */}
                {editingCategory && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-orange-100"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-saffron/10 rounded-full flex items-center justify-center">
                                        <Edit className="h-6 w-6 text-saffron" />
                                    </div>
                                    <h3 className="font-cinzel text-xl font-bold text-[#2D1B1B]">Edit Category</h3>
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingCategory(null)
                                        setEditCategoryName('')
                                    }}
                                    className="p-2 text-[#4A3737]/40 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateCategory} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#4A3737]/60 mb-2">Category Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={editCategoryName}
                                        onChange={(e) => setEditCategoryName(e.target.value)}
                                        placeholder="Enter category name"
                                        className="w-full px-4 py-3 bg-white border border-orange-100 rounded-xl focus:ring-2 focus:ring-saffron/20 focus:border-saffron outline-none transition-all font-bold placeholder:font-normal placeholder:opacity-30"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingCategory(null)
                                            setEditCategoryName('')
                                        }}
                                        className="flex-1 py-3 bg-gray-50 text-[#4A3737]/60 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isEditSubmitting}
                                        className="flex-1 py-3 bg-saffron text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-orange-600 shadow-lg shadow-saffron/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isEditSubmitting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            'Update'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

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
                                <h3 className="font-cinzel text-xl font-bold text-[#2D1B1B] mb-2">Delete Category?</h3>
                                <p className="text-[#4A3737]/60 text-sm mb-8">
                                    Are you sure you want to remove this category? Products using this category will retain it until updated.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeleteId(null)}
                                        disabled={isDeleting}
                                        className="flex-1 py-3 bg-gray-50 text-[#4A3737]/60 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                        className="flex-1 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isDeleting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            'Delete'
                                        )}
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
