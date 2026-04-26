'use client'

import React, { useState, useEffect } from 'react'
import { Product } from '@/data/products'
import ProductCard from '@/components/product-card'

const STORAGE_KEY = 'shivshakti_recently_viewed'

interface ViewedItem {
    productId: string
    viewedAt: number
}

export default function RecentlyViewed({ allProducts }: { allProducts: Product[] }) {
    const [viewedProducts, setViewedProducts] = useState<Product[]>([])

    useEffect(() => {
        try {
            const stored: ViewedItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
            if (stored.length === 0) return

            const productMap = new Map(allProducts.map(p => [p.id.toString(), p]))
            const matched = stored
                .map(item => productMap.get(item.productId))
                .filter((p): p is Product => !!p)

            setViewedProducts(matched)
        } catch {}
    }, [allProducts])

    if (viewedProducts.length === 0) return null

    return (
        <section className="py-12 lg:py-16 bg-[#FDF8F3]">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-playfair font-semibold text-[#1A1A1A]">
                        You Might Be Interested In
                    </h2>
                    <p className="text-sm text-[#717171] mt-1">
                        Based on your recent browsing
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {viewedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
