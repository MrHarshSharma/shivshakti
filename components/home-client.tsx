'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Truck, Shield, Gift, Clock } from 'lucide-react'
import { Product } from '@/data/products'
import ProductCard from '@/components/product-card'

export default function HomeClient({ products }: { products: Product[] }) {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-[#FDF2F4]">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 items-center py-12 lg:py-20">
                        {/* Content */}
                        <div className="text-center lg:text-left">
                            <span className="inline-block px-3 py-1 bg-[#8B1538] text-white text-xs font-medium rounded-full mb-4">
                                New Collection
                            </span>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-semibold text-[#1A1A1A] mb-4 leading-tight">
                                Premium Gift Hampers
                                <br />
                                <span className="text-[#8B1538]">Made with Love</span>
                            </h1>
                            <p className="text-base text-[#4A4A4A] mb-8 max-w-md mx-auto lg:mx-0">
                                Discover our handcrafted collection of luxury gift hampers, perfect for every occasion and celebration.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link
                                    href="/products"
                                    className="w-full sm:w-auto px-8 py-3 bg-[#8B1538] text-white font-medium rounded-lg hover:bg-[#6B102B] transition-colors flex items-center justify-center gap-2"
                                >
                                    Shop Now
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/about"
                                    className="w-full sm:w-auto px-8 py-3 bg-white text-[#1A1A1A] font-medium rounded-lg border border-[#E0E0E0] hover:border-[#1A1A1A] transition-colors"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="relative">
                            <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
                                <Image
                                    src="/hero-hamper.png"
                                    alt="Premium Gift Hamper"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="border-b border-[#EBEBEB]">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
                        {[
                            { icon: Truck, title: 'Free Shipping', desc: 'On orders ₹999+' },
                            { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
                            { icon: Gift, title: 'Gift Wrapping', desc: 'Premium packaging' },
                            { icon: Clock, title: 'Fast Delivery', desc: '3-5 business days' },
                        ].map((item) => (
                            <div key={item.title} className="flex items-center gap-3 p-3">
                                <div className="w-10 h-10 rounded-full bg-[#FDF2F4] flex items-center justify-center flex-shrink-0">
                                    <item.icon className="w-5 h-5 text-[#8B1538]" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#1A1A1A]">{item.title}</p>
                                    <p className="text-xs text-[#717171]">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-playfair font-semibold text-[#1A1A1A]">
                                Featured Products
                            </h2>
                            <p className="text-sm text-[#717171] mt-1">
                                Handpicked selections for you
                            </p>
                        </div>
                        <Link
                            href="/products"
                            className="hidden md:flex items-center gap-2 text-sm font-medium text-[#8B1538] hover:underline"
                        >
                            View All
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Products Grid */}
                    {products.length === 0 ? (
                        <div className="text-center py-16 bg-[#F8F8F8] rounded-lg">
                            <Gift className="w-12 h-12 text-[#717171] mx-auto mb-4" />
                            <p className="text-lg font-medium text-[#1A1A1A] mb-2">Coming Soon</p>
                            <p className="text-sm text-[#717171]">
                                Our collection is being curated. Check back soon!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                            {products.slice(0, 8).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Mobile View All */}
                    <div className="mt-8 text-center md:hidden">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B1538] text-white font-medium rounded-lg"
                        >
                            View All Products
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories / Banner Section */}
            <section className="py-12 lg:py-16 bg-[#F8F8F8]">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Banner 1 */}
                        <div className="relative bg-[#8B1538] rounded-xl overflow-hidden p-8 lg:p-10 text-white min-h-[280px] flex flex-col justify-end">
                            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                                <div className="absolute inset-0 bg-gradient-to-l from-white to-transparent" />
                            </div>
                            <span className="text-xs font-medium tracking-wider uppercase opacity-80 mb-2">
                                Corporate Gifting
                            </span>
                            <h3 className="text-2xl lg:text-3xl font-playfair font-semibold mb-3">
                                Bulk Orders<br />Available
                            </h3>
                            <p className="text-sm opacity-90 mb-4 max-w-xs">
                                Special discounts on bulk orders for corporate events and celebrations.
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                            >
                                Contact Us
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Banner 2 */}
                        <div className="relative bg-white rounded-xl overflow-hidden p-8 lg:p-10 border border-[#EBEBEB] min-h-[280px] flex flex-col justify-end">
                            <div className="absolute top-4 right-4 w-24 h-24 bg-[#FDF2F4] rounded-full opacity-50" />
                            <span className="text-xs font-medium tracking-wider uppercase text-[#8B1538] mb-2">
                                Festival Special
                            </span>
                            <h3 className="text-2xl lg:text-3xl font-playfair font-semibold text-[#1A1A1A] mb-3">
                                Custom<br />Hampers
                            </h3>
                            <p className="text-sm text-[#717171] mb-4 max-w-xs">
                                Create personalized gift hampers tailored to your requirements.
                            </p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 text-sm font-medium text-[#8B1538] hover:underline"
                            >
                                Explore Now
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-playfair font-semibold text-[#1A1A1A] mb-2">
                            Why Choose Shivshakti?
                        </h2>
                        <p className="text-sm text-[#717171]">
                            What makes us different from others
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Handcrafted Quality',
                                desc: 'Each hamper is carefully curated and assembled by hand to ensure the highest quality.',
                            },
                            {
                                title: 'Premium Ingredients',
                                desc: 'We source only the finest ingredients from trusted local artisans and suppliers.',
                            },
                            {
                                title: 'Beautiful Packaging',
                                desc: 'Our eco-friendly packaging is designed to make a lasting impression.',
                            },
                        ].map((item, index) => (
                            <div key={index} className="text-center p-6">
                                <div className="w-12 h-12 bg-[#FDF2F4] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-lg font-semibold text-[#8B1538]">{index + 1}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{item.title}</h3>
                                <p className="text-sm text-[#717171] leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter / CTA */}
            <section className="py-12 lg:py-16 bg-[#1A1A1A]">
                <div className="container mx-auto px-4 lg:px-8 text-center">
                    <h2 className="text-2xl font-playfair font-semibold text-white mb-3">
                        Stay Updated
                    </h2>
                    <p className="text-sm text-white/70 mb-6 max-w-md mx-auto">
                        Follow us on Instagram for new arrivals, offers, and gifting inspiration.
                    </p>
                    <a
                        href="https://www.instagram.com/shiv_shakti_provision"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1A1A1A] font-medium rounded-lg hover:bg-[#F8F8F8] transition-colors"
                    >
                        Follow @shiv_shakti_provision
                    </a>
                </div>
            </section>
        </div>
    )
}
