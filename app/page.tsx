
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Gift, Star, Sparkles } from 'lucide-react'
import { products } from '@/data/products'
import ProductCard from '@/components/product-card'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FEFBF5]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-36 md:pt-40">
        {/* Background Patterns */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-saffron rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-magenta rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[40px] border-orange-100 rounded-full opacity-30" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-6 border border-orange-100">
              <Sparkles className="h-4 w-4 text-saffron fill-saffron" />
              <span className="text-[#4A3737] text-xs font-bold uppercase tracking-widest">
                Handmade with Love
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-cinzel font-bold tracking-tight mb-6 text-[#2D1B1B] leading-tight">
              Celebrate Life's <span className="text-magenta relative inline-block">
                Colors
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#4A3737]/80 max-w-xl mx-auto lg:mx-0 mb-10 font-playfair leading-relaxed">
              Discover our vibrant collection of handcrafted hampers, gourmet treats, and festive decor designed to spread joy and warmth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/products"
                className="px-8 py-4 bg-saffron text-white font-bold tracking-widest uppercase rounded-full hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-300/50 flex items-center gap-2"
              >
                Explore Hampers <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-white text-[#4A3737] border-2 border-orange-100 font-bold tracking-widest uppercase rounded-full hover:border-saffron hover:text-saffron transition-all"
              >
                Our Story
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] md:aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 border-8 border-white">
              <Image
                src="https://images.unsplash.com/photo-1657159811712-e07d0a538c6f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0"
                alt="Festive Gifting"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating Elements */}
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl animate-bounce duration-3000">
              <p className="font-cinzel text-3xl font-bold text-magenta">100%</p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A3737]">Artisan Made</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-[#FEFBF5]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-cinzel text-4xl text-[#2D1B1B] mb-4">Curated with Joy</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-saffron to-magenta mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {products.slice(0, 3).map((product, index, array) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={index === array.length - 1 && array.length % 2 !== 0 ? 'col-span-2 md:col-span-1' : ''}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/products" className="inline-block px-10 py-4 border-2 border-[#2D1B1B] text-[#2D1B1B] hover:bg-[#2D1B1B] hover:text-white transition-colors font-bold uppercase tracking-widest rounded-full">
              View Full Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-emerald-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 text-center">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-emerald-600">
                <Gift className="w-8 h-8" />
              </div>
              <h3 className="font-cinzel text-xl font-bold mb-2 text-[#2D1B1B]">Beautiful Packaging</h3>
              <p className="text-[#4A3737]/70">Hand-wrapped in reusable, eco-friendly vibrant boxes.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-orange-500">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="font-cinzel text-xl font-bold mb-2 text-[#2D1B1B]">Premium Quality</h3>
              <p className="text-[#4A3737]/70">Sourced directly from artisans and organic farms.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-pink-600">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-cinzel text-xl font-bold mb-2 text-[#2D1B1B]">Thoughtful Curation</h3>
              <p className="text-[#4A3737]/70">Combinations designed to create the perfect festive mood.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
