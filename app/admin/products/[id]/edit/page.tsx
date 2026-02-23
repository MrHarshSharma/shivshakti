'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Plus, Save, Loader2, ArrowLeft, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

const PREDEFINED_CATEGORIES = ['Gourmet', 'Hampers', 'Dry fruits', 'Other']

export default function AdminEditProductPage() {
    const params = useParams()
    const router = useRouter()
    const productId = params.id

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        productDetails: '',
        careInstructions: '',
        price: '',
        categories: [] as string[],
        categoryInput: '',
    })
    const [productType, setProductType] = useState<'simple' | 'variable'>('simple')
    const [variations, setVariations] = useState<any[]>([
        { id: Math.random().toString(36).substr(2, 9), name: '', price: '', stock: '', sku: '', is_default: true }
    ])
    const [existingImages, setExistingImages] = useState<string[]>([])
    const [newImages, setNewImages] = useState<string[]>([])
    const [newImageFiles, setNewImageFiles] = useState<File[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const descriptionRef = useRef<HTMLTextAreaElement>(null)
    const detailsRef = useRef<HTMLTextAreaElement>(null)
    const careRef = useRef<HTMLTextAreaElement>(null)

    // Auto-resize textarea based on content
    const autoResizeTextarea = useCallback((element: HTMLTextAreaElement | null) => {
        if (!element) return
        element.style.height = 'auto'
        element.style.height = `${element.scrollHeight}px`
    }, [])

    const handleTextareaChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        field: 'description' | 'productDetails' | 'careInstructions'
    ) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }))
        autoResizeTextarea(e.target)
    }

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

    useEffect(() => {
        if (productId) {
            fetchProduct()
        }
    }, [productId])

    // Auto-resize textareas after data is loaded
    useEffect(() => {
        if (!isLoading) {
            // Small delay to ensure DOM is updated
            setTimeout(() => {
                autoResizeTextarea(descriptionRef.current)
                autoResizeTextarea(detailsRef.current)
                autoResizeTextarea(careRef.current)
            }, 0)
        }
    }, [isLoading, autoResizeTextarea])

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${productId}`, { cache: 'no-store' })
            const data = await response.json()

            if (data.success) {
                const product = data.product
                let parsedDescription = product.description;
                let details = '';
                let care = '';

                try {
                    const jsonDesc = JSON.parse(product.description);
                    if (typeof jsonDesc === 'object' && jsonDesc !== null) {
                        parsedDescription = jsonDesc.productDescription || '';
                        details = jsonDesc.productDetails || '';
                        care = jsonDesc.careInstructions || '';
                    }
                } catch (e) {
                    // Not a JSON string, assume it's just the description
                    parsedDescription = product.description;
                }

                setFormData({
                    name: product.name,
                    description: parsedDescription,
                    productDetails: details,
                    careInstructions: care,
                    price: product.price != null ? product.price.toString() : '',
                    categories: product.categories || [],
                    categoryInput: '',
                })
                setProductType(product.product_type || 'simple')
                if (product.variations && product.variations.length > 0) {
                    setVariations(product.variations)
                } else if (product.product_type === 'variable') {
                    setVariations([{ id: Math.random().toString(36).substr(2, 9), name: '', price: '', stock: '', sku: '', is_default: true }])
                }
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
            // Combine description parts into a JSON object
            const descriptionObject = {
                productDescription: formData.description,
                productDetails: formData.productDetails,
                careInstructions: formData.careInstructions
            }

            const productData = {
                name: formData.name,
                description: JSON.stringify(descriptionObject),
                price: productType === 'simple' ? Number(formData.price) : null,
                categories: formData.categories,
                images: finalImageUrls,
                product_type: productType,
                variations: productType === 'variable' ? variations : null
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
                    <Link href="/admin/products" className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-orange-100 text-saffron hover:text-orange-600 text-xs font-bold uppercase tracking-wider mb-6 transition-all group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Products
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
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white"
                            placeholder="Enter product name"
                        />
                    </div>

                    {/* Product Type Selector */}
                    <div>
                        <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-4">
                            Product Type
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setProductType('simple')}
                                className={`px-4 py-3 rounded-xl border-2 transition-all font-playfair flex items-center justify-center gap-2 ${productType === 'simple'
                                    ? 'border-saffron bg-saffron/5 text-saffron shadow-sm'
                                    : 'border-orange-100 bg-white text-[#4A3737] hover:border-orange-200'
                                    }`}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${productType === 'simple' ? 'border-saffron' : 'border-orange-200'}`}>
                                    {productType === 'simple' && <div className="w-2 h-2 rounded-full bg-saffron" />}
                                </div>
                                <span className="font-bold">Simple Product</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setProductType('variable')}
                                className={`px-4 py-3 rounded-xl border-2 transition-all font-playfair flex items-center justify-center gap-2 ${productType === 'variable'
                                    ? 'border-purple-500 bg-purple-50 text-purple-600 shadow-sm'
                                    : 'border-orange-100 bg-white text-[#4A3737] hover:border-orange-200'
                                    }`}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${productType === 'variable' ? 'border-purple-500' : 'border-orange-200'}`}>
                                    {productType === 'variable' && <div className="w-2 h-2 rounded-full bg-purple-500" />}
                                </div>
                                <span className="font-bold">Variable Product</span>
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-[#4A3737]/60 font-playfair">
                            {productType === 'simple'
                                ? 'Simple products have a single fixed price and stock.'
                                : 'Variable products allow you to add multiple variations (e.g., sizes, weights) with different prices.'}
                        </p>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-4">
                        <h3 className="font-playfair font-bold text-lg text-[#2D1B1B]">Product Info</h3>

                        {/* Product Description */}
                        <div>
                            <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                                Product Description *
                            </label>
                            <textarea
                                ref={descriptionRef}
                                required
                                value={formData.description}
                                onChange={(e) => handleTextareaChange(e, 'description')}
                                className="w-full px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white resize-none min-h-[100px] overflow-hidden"
                                placeholder="Enter main product description"
                            />
                        </div>

                        {/* Product Details */}
                        <div>
                            <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                                Product Details
                            </label>
                            <textarea
                                ref={detailsRef}
                                value={formData.productDetails}
                                onChange={(e) => handleTextareaChange(e, 'productDetails')}
                                className="w-full px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white resize-none min-h-[100px] overflow-hidden"
                                placeholder="Enter detailed specifications"
                            />
                        </div>

                        {/* Care Instructions */}
                        <div>
                            <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                                Care Instructions
                            </label>
                            <textarea
                                ref={careRef}
                                value={formData.careInstructions}
                                onChange={(e) => handleTextareaChange(e, 'careInstructions')}
                                className="w-full px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white resize-none min-h-[80px] overflow-hidden"
                                placeholder="Enter care instructions"
                            />
                        </div>
                    </div>

                    {/* Price - Only for Simple Product */}
                    {productType === 'simple' ? (
                        <div>
                            <label className="block font-playfair text-sm font-semibold text-[#2D1B1B] mb-2">
                                Price (₹) *
                            </label>
                            <input
                                type="number"
                                required={productType === 'simple'}
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                className="w-full px-4 py-3 border border-orange-200 rounded-lg font-playfair focus:outline-none focus:ring-2 focus:ring-saffron/20 bg-white"
                                placeholder="Enter price"
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="block font-playfair text-sm font-semibold text-[#2D1B1B]">
                                    Variations Management *
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setVariations([...variations, { id: Math.random().toString(36).substr(2, 9), name: '', price: '', stock: '', sku: '', is_default: false }])}
                                    className="text-xs font-bold text-saffron hover:text-orange-600 flex items-center gap-1 transition-colors uppercase tracking-widest"
                                >
                                    <Plus className="h-3 w-3" /> Add Variation
                                </button>
                            </div>

                            <div className="space-y-4">
                                {variations.map((variation, index) => (
                                    <div key={variation.id} className="p-6 border-2 border-orange-50 rounded-2xl bg-orange-50/20 relative group/var">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-tighter text-[#4A3737]/60 mb-1">Name (e.g. 1kg, Small)</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={variation.name}
                                                    onChange={(e) => {
                                                        const newVars = [...variations]
                                                        newVars[index].name = e.target.value
                                                        setVariations(newVars)
                                                    }}
                                                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                                                    placeholder="Variation name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-tighter text-[#4A3737]/60 mb-1">Price (₹)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={variation.price}
                                                    onChange={(e) => {
                                                        const newVars = [...variations]
                                                        newVars[index].price = e.target.value
                                                        setVariations(newVars)
                                                    }}
                                                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                                                    placeholder="Price"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-tighter text-[#4A3737]/60 mb-1">Stock</label>
                                                <input
                                                    type="number"
                                                    value={variation.stock}
                                                    onChange={(e) => {
                                                        const newVars = [...variations]
                                                        newVars[index].stock = e.target.value
                                                        setVariations(newVars)
                                                    }}
                                                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                                                    placeholder="Stock"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-tighter text-[#4A3737]/60 mb-1">SKU (Internal ID)</label>
                                                <input
                                                    type="text"
                                                    value={variation.sku}
                                                    onChange={(e) => {
                                                        const newVars = [...variations]
                                                        newVars[index].sku = e.target.value
                                                        setVariations(newVars)
                                                    }}
                                                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                                                    placeholder="SKU"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={variation.is_default}
                                                    onChange={() => {
                                                        const newVars = variations.map((v, i) => ({
                                                            ...v,
                                                            is_default: i === index
                                                        }))
                                                        setVariations(newVars)
                                                    }}
                                                    className="rounded text-saffron focus:ring-saffron"
                                                />
                                                <span className="text-[11px] font-bold text-[#4A3737] uppercase tracking-wider">Default Variation</span>
                                            </label>

                                            {variations.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setVariations(variations.filter((_, i) => i !== index))}
                                                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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
                                        onChange={(e) => setFormData(prev => ({ ...prev, categoryInput: e.target.value }))}
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
