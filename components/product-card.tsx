'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/data/products'

export default function ProductCard({ product }: { product: Product }) {
    const getPrice = () => {
        if ((product as any).product_type === 'variable' && (product as any).variations) {
            const prices = (product as any).variations.map((v: any) => v.price)
            const minPrice = Math.min(...prices)
            const maxPrice = Math.max(...prices)
            return minPrice === maxPrice
                ? `₹${minPrice.toLocaleString()}`
                : `₹${minPrice.toLocaleString()} - ₹${maxPrice.toLocaleString()}`
        }
        return `₹${product.price.toLocaleString()}`
    }

    const getDescription = () => {
        try {
            const jsonDesc = JSON.parse(product.description)
            return jsonDesc.productDescription || product.description
        } catch {
            return product.description
        }
    }

    return (
        <Link href={`/product/${product.id}`} className="group block">
            <div className="bg-white rounded-lg border border-[#EBEBEB] overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[#E0E0E0]">
                {/* Image */}
                <div className="relative aspect-square bg-[#F8F8F8] overflow-hidden">
                    <Image
                        src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.png'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Badges */}
                    {product.isNew && (
                        <span className="absolute top-3 left-3 px-2 py-1 bg-[#D29B6C] text-white text-[10px] font-semibold rounded">
                            NEW
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Category */}
                    {product.categories && product.categories.length > 0 && (
                        <p className="text-[11px] text-[#717171] uppercase tracking-wide mb-1">
                            {product.categories[0]}
                        </p>
                    )}

                    {/* Name */}
                    <h3 className="text-sm font-medium text-[#1A1A1A] mb-1 line-clamp-2 group-hover:text-[#D29B6C] transition-colors">
                        {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#717171] mb-3 line-clamp-2">
                        {getDescription()}
                    </p>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <p className="text-base font-semibold text-[#1A1A1A]">
                            {getPrice()}
                        </p>
                        {(product as any).product_type === 'variable' && (
                            <span className="text-[10px] text-[#717171]">
                                {(product as any).variations?.length} options
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
