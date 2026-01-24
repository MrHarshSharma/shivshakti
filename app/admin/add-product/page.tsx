'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Plus, Save, Loader2, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

const PREDEFINED_CATEGORIES = ['Gourmet', 'Hampers', 'Dry fruits', 'Other']

export default function AdminAddProductPage() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        categories: [] as string[],
        categoryInput: '',
    })
    const [images, setImages] = useState<string[]>([])
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Handle clicking outside of dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newFiles = Array.from(files)
        const newImageUrls = newFiles.map(file => URL.createObjectURL(file))

        setImageFiles(prev => [...prev, ...newFiles])
        setImages(prev => [...prev, ...newImageUrls])
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setImageFiles(prev => prev.filter((_, i) => i !== index))
    }

    const addCategory = (categoryName?: string) => {
        const nameToAdd = (categoryName || formData.categoryInput).trim()
        if (nameToAdd && !formData.categories.includes(nameToAdd)) {
            setFormData(prev => ({
                ...prev,
                categories: [...prev.categories, nameToAdd],
                categoryInput: categoryName ? prev.categoryInput : ''
            }))
            if (categoryName) setShowDropdown(false)
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
        setSubmitMessage(null)

        try {
            // First, upload images to Supabase Storage
            const imageUploadFormData = new FormData()
            imageFiles.forEach(file => {
                imageUploadFormData.append('images', file)
            })

            const uploadResponse = await fetch('/api/upload-images', {
                method: 'POST',
                body: imageUploadFormData,
            })

            const uploadData = await uploadResponse.json()

            if (!uploadResponse.ok) {
                throw new Error(uploadData.error || 'Failed to upload images')
            }

            const imageUrls = uploadData.urls

            // Then create the product with the uploaded image URLs
            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseInt(formData.price),
                categories: formData.categories,
                images: imageUrls,
            }

            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add product')
            }

            setSubmitMessage({ type: 'success', text: 'Product added successfully!' })

            // Reset form
            setFormData({
                name: '',
                description: '',
                price: '',
                categories: [],
                categoryInput: '',
            })
            setImages([])
            setImageFiles([])

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' })

        } catch (error) {
            console.error('Error adding product:', error)
            setSubmitMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Failed to add product'
            })
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#FEFBF5] pt-32 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="text-saffron hover:text-orange-600 text-sm font-bold uppercase tracking-wider mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="font-cinzel text-4xl text-[#2D1B1B] mb-2">Add New Product</h1>
                    <p className="text-[#4A3737]/70 font-playfair">Fill in the details to add a new product to the catalog</p>
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
                        <div className="relative" ref={dropdownRef}>
                            <div className="flex gap-2 mb-3">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={formData.categoryInput}
                                        onChange={(e) => setFormData({ ...formData, categoryInput: e.target.value })}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                                        onFocus={() => setShowDropdown(true)}
                                        className="w-full px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white pr-10"
                                        placeholder="Type to search or select from dropdown"
                                    />
                                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-300 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                </div>
                            </div>

                            {/* Dropdown */}
                            {showDropdown && (
                                <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-orange-100 rounded-xl shadow-xl overflow-hidden py-1">
                                    {PREDEFINED_CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => addCategory(cat)}
                                            className="w-full text-left px-4 py-3 font-playfair text-sm hover:bg-orange-50 transition-colors flex items-center justify-between group"
                                        >
                                            <span className={formData.categories.includes(cat) ? 'text-saffron font-bold' : 'text-[#4A3737]'}>
                                                {cat}
                                            </span>
                                            {formData.categories.includes(cat) && (
                                                <span className="text-[10px] bg-orange-100 text-saffron px-2 py-0.5 rounded-full font-bold">Selected</span>
                                            )}
                                        </button>
                                    ))}
                                    {PREDEFINED_CATEGORIES.length > 0 && formData.categoryInput && !PREDEFINED_CATEGORIES.some(c => c.toLowerCase() === formData.categoryInput.trim().toLowerCase()) && (
                                        <div className="border-t border-orange-50 p-2">
                                            <button
                                                type="button"
                                                onClick={() => addCategory()}
                                                className="w-full text-left px-2 py-2 text-xs font-bold text-saffron hover:bg-orange-50 rounded transition-colors uppercase tracking-widest"
                                            >
                                                Add "{formData.categoryInput}" as new
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
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
                                <p className="font-playfair text-[#2D1B1B] font-semibold mb-1">Click to upload images</p>
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

                        {/* Image Preview Grid */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                {images.map((image, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-orange-100 group"
                                    >
                                        <Image
                                            src={image}
                                            alt={`Product ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
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
                    {submitMessage && (
                        <div className={`p-4 rounded-lg ${submitMessage.type === 'success'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                            : 'bg-red-50 border border-red-200 text-red-700'
                            }`}>
                            <p className="font-playfair text-sm">{submitMessage.text}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || images.length === 0}
                        className="w-full py-4 bg-[#2D1B1B] text-white font-bold uppercase tracking-widest hover:bg-saffron transition-colors shadow-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Adding Product...
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                Add Product
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
