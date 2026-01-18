'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Plus, Save, Loader2, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export default function AdminEditProductPage() {
    const params = useParams()
    const router = useRouter()
    const productId = params.id

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categories: [] as string[],
        categoryInput: '',
    })
    const [existingImages, setExistingImages] = useState<string[]>([])
    const [newImages, setNewImages] = useState<string[]>([])
    const [newImageFiles, setNewImageFiles] = useState<File[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        if (productId) {
            fetchProduct()
        }
    }, [productId])

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${productId}`, { cache: 'no-store' })
            const data = await response.json()

            if (data.success) {
                const product = data.product
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price.toString(),
                    categories: product.categories || [],
                    categoryInput: '',
                })
                setExistingImages(product.images || [])
            } else {
                throw new Error(data.error || 'Failed to fetch product')
            }
        } catch (error) {
            console.error('Error fetching product:', error)
            setMessage({ type: 'error', text: 'Failed to load product details' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newFiles = Array.from(files)
        const newUrls = newFiles.map(file => URL.createObjectURL(file))

        setNewImageFiles(prev => [...prev, ...newFiles])
        setNewImages(prev => [...prev, ...newUrls])
    }

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index))
    }

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index))
        setNewImageFiles(prev => prev.filter((_, i) => i !== index))
    }

    const addCategory = () => {
        if (formData.categoryInput.trim() && !formData.categories.includes(formData.categoryInput.trim())) {
            setFormData(prev => ({
                ...prev,
                categories: [...prev.categories, prev.categoryInput.trim()],
                categoryInput: ''
            }))
        }
    }

    const removeCategory = (category: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c !== category)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setMessage(null)

        try {
            let uploadedUrls: string[] = []

            // 1. Upload new images if any
            if (newImageFiles.length > 0) {
                const uploadFormData = new FormData()
                newImageFiles.forEach(file => {
                    uploadFormData.append('images', file)
                })

                const uploadResponse = await fetch('/api/upload-images', {
                    method: 'POST',
                    body: uploadFormData,
                })

                const uploadData = await uploadResponse.json()
                if (!uploadResponse.ok) throw new Error(uploadData.error || 'Failed to upload new images')
                uploadedUrls = uploadData.urls
            }

            // 2. Combine existing (kept) images with newly uploaded ones
            const finalImageUrls = [...existingImages, ...uploadedUrls]

            if (finalImageUrls.length === 0) {
                throw new Error('At least one product image is required')
            }

            // 3. Update product data
            const productData = {
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                categories: formData.categories,
                images: finalImageUrls,
            }

            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || 'Failed to update product')

            setMessage({ type: 'success', text: 'Product updated successfully!' })

            // Wait a bit then redirect
            setTimeout(() => {
                router.push('/admin/products')
            }, 1500)

        } catch (error) {
            console.error('Error updating product:', error)
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Failed to update product'
            })
        } finally {
            setIsSubmitting(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FEFBF5] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-saffron mx-auto mb-4" />
                    <p className="font-playfair text-[#4A3737]">Loading product details...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FEFBF5] pt-32 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin/products" className="text-saffron hover:text-orange-600 text-sm font-bold uppercase tracking-wider mb-4 inline-flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Products
                    </Link>
                    <h1 className="font-cinzel text-4xl text-[#2D1B1B] mb-2">Edit Product</h1>
                    <p className="text-[#4A3737]/70 font-playfair">Update details for "{formData.name}"</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8 space-y-6">
                    {/* Product Name */}
                    <div>
                        <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white"
                            placeholder="Enter product name"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                            Description *
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white resize-none"
                            placeholder="Enter product description"
                            rows={4}
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                            Price (₹) *
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white"
                            placeholder="Enter price"
                        />
                    </div>

                    {/* Categories */}
                    <div>
                        <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                            Categories
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={formData.categoryInput}
                                onChange={(e) => setFormData({ ...formData, categoryInput: e.target.value })}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                                className="flex-1 px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white"
                                placeholder="Enter category and press Enter"
                            />
                            <button
                                type="button"
                                onClick={addCategory}
                                className="px-4 py-3 bg-saffron text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                <Plus className="h-5 w-5" />
                            </button>
                        </div>
                        {formData.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.categories.map((category) => (
                                    <span
                                        key={category}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-[#2D1B1B] rounded-full text-sm font-playfair"
                                    >
                                        {category}
                                        <button
                                            type="button"
                                            onClick={() => removeCategory(category)}
                                            className="hover:text-red-500 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                            Product Images *
                        </label>

                        {/* Upload Button */}
                        <label className="block w-full cursor-pointer">
                            <div className="border-2 border-dashed border-orange-200 rounded-lg p-8 text-center hover:border-saffron transition-colors bg-orange-50/30">
                                <Upload className="h-12 w-12 text-saffron mx-auto mb-3" />
                                <p className="font-playfair text-[#2D1B1B] font-semibold mb-1">Upload new images</p>
                                <p className="text-sm text-[#4A3737]/70">PNG, JPG up to 10MB (multiple files allowed)</p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>

                        {/* Combined Image Preview Grid */}
                        {(existingImages.length > 0 || newImages.length > 0) && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                {/* Existing Images */}
                                {existingImages.map((image, index) => (
                                    <div key={`existing-${index}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-orange-100 group">
                                        <Image src={image} alt={`Product existing ${index + 1}`} fill className="object-cover" />
                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold uppercase rounded">Existing</div>
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}

                                {/* New Images */}
                                {newImages.map((image, index) => (
                                    <motion.div
                                        key={`new-${index}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-saffron group"
                                    >
                                        <Image src={image} alt={`Product new ${index + 1}`} fill className="object-cover" />
                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-saffron text-white text-[10px] font-bold uppercase rounded">New</div>
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Message */}
                    {message && (
                        <div className={`p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                            : 'bg-red-50 border border-red-200 text-red-700'
                            }`}>
                            <p className="font-playfair text-sm">{message.text}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || (existingImages.length === 0 && newImages.length === 0)}
                        className="w-full py-4 bg-[#2D1B1B] text-white font-bold uppercase tracking-widest hover:bg-saffron transition-colors shadow-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Updating Product...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Update Product
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
