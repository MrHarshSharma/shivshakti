'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { Product } from '@/data/products'

export default function ProductCard({ product }: { product: Product }) {
    const getPrice = () => {
        if ((product as any).product_type === 'variable' && (product as any).variations) {
            const prices = (product as any).variations.map((v: any) => v.price)
            const minPrice = Math.min(...prices)
            const maxPrice = Math.max(...prices)
            return minPrice === maxPrice
                ? `$${minPrice.toLocaleString()}`
                : `$${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`
        }
        return `$${product.price.toLocaleString()}`
    }

    const getDescription = () => {
        try {
            const jsonDesc = JSON.parse(product.description)
            return jsonDesc.productDescription || product.description
        } catch {
            return product.description
        }
    }

    const isOutOfStock = product.in_stock === false

    const handleEnquire = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const productName = product.name
        const message = `Hello, I would like to enquire about the availability of ${productName}. When will it be back in stock?`
        const whatsappNumber = '919665654326'
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    const cardContent = (
        <div className={`bg-white rounded-lg border border-[#EBEBEB] overflow-hidden transition-all duration-200 relative ${isOutOfStock ? 'opacity-60' : 'hover:shadow-md hover:border-[#E0E0E0]'}`}>
            {/* Image */}
            <div className="relative aspect-square bg-[#F8F8F8] overflow-hidden">
                <Image
                    src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.png'}
                    alt={product.name}
                    fill
                    className={`object-cover transition-transform duration-300 group-hover:scale-105 ${isOutOfStock ? 'grayscale' : ''}`}
                />

                {/* Badges */}
                {isOutOfStock ? (
                    <span className="absolute top-3 left-3 px-3 py-1.5 bg-[#4A4A4A] text-white text-[10px] font-semibold rounded z-10">
                        OUT OF STOCK
                    </span>
                ) : product.isNew ? (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-[#D29B6C] text-white text-[10px] font-semibold rounded">
                        NEW
                    </span>
                ) : null}

                {/* Floating Enquire Button with Backdrop */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                        <button
                            onClick={handleEnquire}
                            className="px-6 py-2.5 bg-[#E8A968] text-white text-sm font-semibold rounded-lg hover:bg-[#D29B6C] transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            <MessageCircle className="h-4 w-4" />
                            Enquire
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Category */}
                {product.categories && product.categories.length > 0 && (
                    <p className={`text-[11px] uppercase tracking-wide mb-1 ${isOutOfStock ? 'text-[#999]' : 'text-[#717171]'}`}>
                        {product.categories[0]}
                    </p>
                )}

                {/* Name */}
                <h3 className={`text-sm font-medium mb-1 line-clamp-2 transition-colors ${isOutOfStock ? 'text-[#999]' : 'text-[#1A1A1A] group-hover:text-[#D29B6C]'}`}>
                    {product.name}
                </h3>

                {/* Description */}
                <p className={`text-xs mb-3 line-clamp-2 ${isOutOfStock ? 'text-[#999]' : 'text-[#717171]'}`}>
                    {getDescription()}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <p className={`text-base font-semibold ${isOutOfStock ? 'text-[#999]' : 'text-[#1A1A1A]'}`}>
                        {getPrice()}
                    </p>
                    {(product as any).product_type === 'variable' && !isOutOfStock && (
                        <span className="text-[10px] text-[#717171]">
                            {(product as any).variations?.length} options
                        </span>
                    )}
                </div>
            </div>
        </div>
    )

    if (isOutOfStock) {
        return <div className="group block cursor-default">{cardContent}</div>
    }

    return (
        <Link href={`/product/${product.id}`} className="group block">
            {cardContent}
        </Link>
    )
}
