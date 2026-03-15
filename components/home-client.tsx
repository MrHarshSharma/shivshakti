'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Truck, Shield, Gift, Clock, Play, ChevronRight, Star } from 'lucide-react'
import { Product } from '@/data/products'
import ProductCard from '@/components/product-card'

export default function HomeClient({ products }: { products: Product[] }) {
    const [activeShoe, setActiveShoe] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        setIsLoaded(true)
        const interval = setInterval(() => {
            setActiveShoe((prev) => (prev + 1) % 3)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    const featuredShoes = [
        {
            name: 'Nike Air Max',
            tagline: 'Elevate Your Run',
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
            color: '#FF6B6B',
            price: '$12,999'
        },
        {
            name: 'Adidas Ultraboost',
            tagline: 'Infinite Energy',
            image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
            color: '#4ECDC4',
            price: '$15,999'
        },
        {
            name: 'Puma RS-X',
            tagline: 'Bold Statement',
            image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
            color: '#FFE66D',
            price: '$9,999'
        }
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative min-h-screen bg-gradient-to-b from-[#F9F7F4] via-white to-white overflow-hidden">
                {/* Animated Grid Background */}
                <div className="absolute inset-0 opacity-[0.4]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(#E8E2D8 1px, transparent 1px), linear-gradient(90deg, #E8E2D8 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }}></div>
                </div>

                {/* Gradient Orbs */}
                <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-[#D29B6C]/30 to-[#E8B98A]/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/2 left-20 w-[300px] h-[300px] bg-gradient-to-tr from-[#D29B6C]/25 to-[#B8845A]/15 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-[#D29B6C]/15 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#D29B6C]/10 to-transparent rounded-full blur-[100px]"></div>

                <div className="container mx-auto px-4 lg:px-12 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-screen py-24 lg:py-32">
                        {/* Content Side */}
                        <div className={`space-y-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            {/* Premium Badge */}
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white shadow-sm rounded-full border border-[#E8E2D8]">
                                <div className="relative">
                                    <div className="w-2 h-2 bg-[#D29B6C] rounded-full"></div>
                                    <div className="absolute inset-0 w-2 h-2 bg-[#D29B6C] rounded-full animate-ping"></div>
                                </div>
                                <span className="text-xs font-medium tracking-[0.2em] text-[#6B6B6B] uppercase">Premium Collection 2026</span>
                            </div>

                            {/* Main Heading */}
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#1A1A1A] leading-[0.95] tracking-tight">
                                    <span className="block overflow-hidden">
                                        <span className={`block transition-transform duration-700 delay-100 ${isLoaded ? 'translate-y-0' : 'translate-y-full'}`}>
                                            Step Into
                                        </span>
                                    </span>
                                    <span className="block overflow-hidden">
                                        <span className={`block transition-transform duration-700 delay-200 ${isLoaded ? 'translate-y-0' : 'translate-y-full'}`}>
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D29B6C] via-[#B8845A] to-[#D29B6C]">
                                                Excellence
                                            </span>
                                        </span>
                                    </span>
                                </h1>

                                <div className={`flex items-center gap-4 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                                    <div className="w-16 h-[2px] bg-gradient-to-r from-[#D29B6C] to-transparent"></div>
                                    <span className="text-[#6B6B6B] text-sm tracking-[0.3em] uppercase">Since 2020</span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className={`text-lg md:text-xl text-[#6B6B6B] leading-relaxed max-w-lg font-light transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                                Curated collection of premium athletic footwear. Where craftsmanship meets innovation, designed for those who refuse to compromise.
                            </p>

                            {/* CTA Buttons */}
                            <div className={`flex flex-col sm:flex-row gap-4 pt-4 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                                <Link
                                    href="/products"
                                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1A1A1A] text-white font-semibold rounded-full overflow-hidden transition-all hover:shadow-2xl hover:shadow-[#1A1A1A]/20 hover:scale-105"
                                >
                                    <span className="relative z-10">Shop Collection</span>
                                    <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#D29B6C] to-[#B8845A] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </Link>

                                <button
                                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-[#1A1A1A] font-medium rounded-full border-2 border-[#E8E2D8] hover:bg-[#F9F7F4] hover:border-[#D29B6C] transition-all"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#F9F7F4] flex items-center justify-center group-hover:bg-[#D29B6C] transition-colors">
                                        <Play className="w-4 h-4 fill-[#D29B6C] text-[#D29B6C] group-hover:fill-white group-hover:text-white ml-0.5 transition-colors" />
                                    </div>
                                    Watch Story
                                </button>
                            </div>

                            {/* Stats Row */}
                            <div className={`flex items-center gap-8 lg:gap-12 pt-8 transition-all duration-700 delay-600 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="group cursor-default">
                                    <div className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-1 group-hover:text-[#D29B6C] transition-colors">12K+</div>
                                    <div className="text-xs text-[#6B6B6B] tracking-wider uppercase">Happy Customers</div>
                                </div>
                                <div className="w-px h-12 bg-[#E8E2D8]"></div>
                                <div className="group cursor-default">
                                    <div className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-1 group-hover:text-[#D29B6C] transition-colors">50+</div>
                                    <div className="text-xs text-[#6B6B6B] tracking-wider uppercase">Premium Styles</div>
                                </div>
                                <div className="w-px h-12 bg-[#E8E2D8]"></div>
                                <div className="group cursor-default">
                                    <div className="flex items-center gap-1 text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-1 group-hover:text-[#D29B6C] transition-colors">
                                        4.9 <Star className="w-5 h-5 fill-[#D29B6C] text-[#D29B6C]" />
                                    </div>
                                    <div className="text-xs text-[#6B6B6B] tracking-wider uppercase">Avg Rating</div>
                                </div>
                            </div>
                        </div>

                        {/* Image Side */}
                        <div className={`relative lg:h-[700px] transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            {/* Orange Glow Behind Product */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] lg:w-[500px] lg:h-[500px]">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#D29B6C]/40 via-[#E8B98A]/30 to-[#D29B6C]/40 rounded-full blur-[80px] animate-pulse"></div>
                                <div className="absolute inset-12 bg-gradient-to-tr from-[#D29B6C]/50 to-[#B8845A]/30 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                            </div>

                            {/* Rotating Glow Ring */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] lg:w-[550px] lg:h-[550px]">
                                <div className="absolute inset-0 rounded-full border border-[#D29B6C]/30 animate-[spin_20s_linear_infinite]"></div>
                                <div className="absolute inset-4 rounded-full border border-[#D29B6C]/20 animate-[spin_25s_linear_infinite_reverse]"></div>
                                <div className="absolute inset-8 rounded-full border border-dashed border-[#E8E2D8] animate-[spin_30s_linear_infinite]"></div>
                            </div>

                            {/* Main Product Display */}
                            <div className="relative z-10 flex items-center justify-center h-full">
                                {featuredShoes.map((shoe, index) => (
                                    <div
                                        key={index}
                                        className={`absolute transition-all duration-700 ease-out ${activeShoe === index
                                                ? 'opacity-100 scale-100 rotate-0'
                                                : 'opacity-0 scale-90 rotate-12'
                                            }`}
                                    >
                                        <div className="relative">
                                            {/* Shoe Image */}
                                            <div className="relative w-[320px] h-[320px] lg:w-[450px] lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl">
                                                <Image
                                                    src={shoe.image}
                                                    alt={shoe.name}
                                                    fill
                                                    className="object-cover hover:scale-105 transition-transform duration-500"
                                                    priority={index === 0}
                                                />
                                            </div>

                                            {/* Floating Info Card */}
                                            <div className="absolute -bottom-4 -right-4 lg:bottom-0 lg:right-0 bg-white rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none p-5 border border-[#E8E2D8] shadow-xl">
                                                <div className="text-xs text-[#6B6B6B] mb-1 uppercase tracking-wider">{shoe.tagline}</div>
                                                <div className="text-xl font-bold text-[#1A1A1A] mb-2">{shoe.name}</div>
                                                <div className="text-2xl font-bold text-[#D29B6C]">{shoe.price}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Shoe Selector Dots */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
                                {featuredShoes.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveShoe(index)}
                                        className={`transition-all duration-300 ${activeShoe === index
                                                ? 'w-8 h-2 bg-[#D29B6C] rounded-full'
                                                : 'w-2 h-2 bg-[#E8E2D8] rounded-full hover:bg-[#D29B6C]/50'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Brand Tags */}
                            <div className="absolute top-8 right-8 flex flex-col gap-2">
                                {['NIKE', 'ADIDAS', 'PUMA'].map((brand, index) => (
                                    <div
                                        key={brand}
                                        className={`px-4 py-2 bg-white shadow-sm rounded-lg border border-[#E8E2D8] text-xs font-bold tracking-wider text-[#1A1A1A] transition-all duration-300 hover:bg-[#F9F7F4] hover:border-[#D29B6C] cursor-pointer ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                                            }`}
                                        style={{ transitionDelay: `${600 + index * 100}ms` }}
                                    >
                                        {brand}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Brand Marquee */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-[#E8E2D8] bg-white/80 backdrop-blur-sm">
                    <div className="overflow-hidden py-4">
                        <div className="flex animate-marquee whitespace-nowrap">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex items-center gap-12 mx-6">
                                    <span className="text-[#1A1A1A]/30 text-sm font-medium tracking-[0.3em] uppercase">Nike</span>
                                    <span className="text-[#D29B6C]">◆</span>
                                    <span className="text-[#1A1A1A]/30 text-sm font-medium tracking-[0.3em] uppercase">Adidas</span>
                                    <span className="text-[#D29B6C]">◆</span>
                                    <span className="text-[#1A1A1A]/30 text-sm font-medium tracking-[0.3em] uppercase">Puma</span>
                                    <span className="text-[#D29B6C]">◆</span>
                                    <span className="text-[#1A1A1A]/30 text-sm font-medium tracking-[0.3em] uppercase">Premium Quality</span>
                                    <span className="text-[#D29B6C]">◆</span>
                                    <span className="text-[#1A1A1A]/30 text-sm font-medium tracking-[0.3em] uppercase">Authentic Products</span>
                                    <span className="text-[#D29B6C]">◆</span>
                                    <span className="text-[#1A1A1A]/30 text-sm font-medium tracking-[0.3em] uppercase">Free Shipping</span>
                                    <span className="text-[#D29B6C]">◆</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-[#6B6B6B]">
                    <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
                    <div className="w-px h-12 bg-gradient-to-b from-[#D29B6C] to-transparent animate-bounce"></div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="bg-white py-12 lg:py-16">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Truck, title: 'Complimentary Shipping', desc: 'On all orders above $2,000' },
                            { icon: Shield, title: '100% Authentic', desc: 'Verified premium products' },
                            { icon: Gift, title: 'Hassle-Free Returns', desc: '7-day easy return policy' },
                            { icon: Clock, title: 'Express Delivery', desc: 'Fast 2-4 day shipping' },
                        ].map((item) => (
                            <div key={item.title} className="group relative bg-gradient-to-br from-[#F9F7F4] to-white p-6 rounded-2xl border border-[#E8E2D8] hover:border-[#D29B6C] transition-all duration-300 hover:shadow-lg">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E8E2D8] flex items-center justify-center flex-shrink-0 group-hover:border-[#D29B6C] group-hover:bg-[#D29B6C] transition-all">
                                        <item.icon className="w-5 h-5 text-[#D29B6C] group-hover:text-white transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">{item.title}</h3>
                                        <p className="text-xs text-[#6B6B6B] font-light leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shop by Category */}
            <section className="py-16 lg:py-24 bg-gradient-to-b from-[#F9F7F4] to-white">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
                            Shop by <span className="italic font-serif text-[#D29B6C]">Category</span>
                        </h2>
                        <p className="text-lg text-[#6B6B6B] font-light">Find your perfect pair for any occasion</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[
                            { name: 'Running', link: '/products?category=Running', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
                            { name: 'Casual', link: '/products?category=Casual', image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400' },
                            { name: 'Sports', link: '/products?category=Sports', image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400' },
                            { name: 'Basketball', link: '/products?category=Basketball', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400' },
                            { name: 'Lifestyle', link: '/products?category=Lifestyle', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400' },
                        ].map((category) => (
                            <Link
                                key={category.name}
                                href={category.link}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                            >
                                <div className="relative aspect-square overflow-hidden">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-xl font-bold !text-white group-hover:!text-white transition-colors" style={{ color: '#FFFFFF', textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
                                        {category.name}
                                    </h3>
                                    <div className="w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 mt-2"></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-4 lg:px-12">
                    {/* Section Header */}
                    <div className="text-center mb-14">
                        <div className="inline-block px-4 py-2 bg-[#F9F7F4] rounded-full mb-4">
                            <span className="text-xs font-medium tracking-wider text-[#D29B6C] uppercase">Curated Selection</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
                            Trending <span className="italic font-serif text-[#D29B6C]">Sneakers</span>
                        </h2>
                        <p className="text-lg text-[#6B6B6B] font-light mb-8">
                            Handpicked premium styles from Nike, Adidas & Puma
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A1A1A] border-b-2 border-[#D29B6C] hover:text-[#D29B6C] transition-colors pb-1"
                        >
                            Explore Full Collection
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
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D29B6C] text-white font-medium rounded-lg"
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
                        <div className="relative bg-[#D29B6C] rounded-xl overflow-hidden p-8 lg:p-10 text-white min-h-[280px] flex flex-col justify-end">
                            <div className="absolute top-4 right-4 w-24 h-24 bg-white rounded-full opacity-20" />
                            <span className="text-xs font-medium tracking-wider uppercase opacity-80 mb-2">
                                Team Orders
                            </span>
                            <span className="text-2xl lg:text-3xl font-playfair font-semibold mb-3 text-white">
                                Bulk Discounts<br />Available
                            </span>
                            <p className="text-sm opacity-90 mb-4 max-w-xs">
                                Special pricing on bulk orders for teams, corporate events, and sports clubs.
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
                            <div className="absolute top-4 right-4 w-24 h-24 bg-[#EBDDC4] rounded-full opacity-50" />
                            <span className="text-xs font-medium tracking-wider uppercase text-[#D29B6C] mb-2">
                                Limited Edition
                            </span>
                            <span className="text-2xl lg:text-3xl font-playfair font-semibold text-[#1A1A1A] mb-3">
                                Exclusive<br />Collections
                            </span>
                            <p className="text-sm text-[#717171] mb-4 max-w-xs">
                                Discover rare and limited-edition sneakers from your favorite brands.
                            </p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 text-sm font-medium text-[#D29B6C] hover:underline"
                            >
                                Shop Now
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
                            Why Choose DedayCart?
                        </h2>
                        <p className="text-sm text-[#717171]">
                            What makes us different from others
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Verified Authentic',
                                desc: 'Every sneaker is 100% authentic and sourced directly from authorized brand retailers.',
                            },
                            {
                                title: 'Curated Collection',
                                desc: 'We handpick only the best styles from Nike, Adidas, and Puma for quality and performance.',
                            },
                            {
                                title: 'Secure Delivery',
                                desc: 'Premium packaging with fast 2-4 day delivery and easy 7-day returns for peace of mind.',
                            },
                        ].map((item, index) => (
                            <div key={index} className="text-center p-6">
                                <div className="w-12 h-12 bg-[#EBDDC4] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-lg font-semibold text-[#D29B6C]">{index + 1}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{item.title}</h3>
                                <p className="text-sm text-[#717171] leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Instagram CTA */}
            <section className="py-16 lg:py-20 bg-[#EBDDC4] relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#D29B6C]/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#D29B6C]/10 rounded-full translate-x-1/3 translate-y-1/3" />
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#D29B6C]/5 rounded-full" />

                <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    <div className="max-w-2xl mx-auto text-center">
                        {/* Instagram Logo */}

                        <h2 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-4">
                            Join Our Sneaker Community
                        </h2>
                        <p className="text-[#4A4A4A] mb-8 text-lg">
                            Follow us on Instagram for latest drops, exclusive sneaker releases, style inspiration, and member-only deals.
                        </p>
                        <a
                            href="https://www.instagram.com/dedaycart"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#F77737] via-[#E1306C] to-[#C13584] text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            @dedaycart
                        </a>
                        <p className="mt-6 text-[#717171] text-sm">
                            Get the latest sneaker drops & exclusive deals
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
