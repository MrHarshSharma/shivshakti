'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShieldCheck, Users, Sparkles, ArrowRight } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#FEFBF5]">
            {/* Hero Section */}
            <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden pt-16 md:pt-24">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/image.png"
                        alt="About Shivshakti"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FEFBF5]" />
                </div>

                <div className="relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-cinzel text-3xl sm:text-4xl md:text-6xl font-bold text-[#2D1B1B] mb-4 md:mb-6 leading-tight">
                            Our Heritage, <span className="text-saffron">Your Story</span>
                        </h1>
                        <p className="font-playfair text-base md:text-xl text-[#4A3737]/80 max-w-2xl mx-auto leading-relaxed px-4">
                            Crafting timeless elegance and celebrating the rich tapestry of Indian artisanship since 1995.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 md:border-8 border-white"
                        >
                            <Image
                                src="/logo.png"
                                alt="Our Craftsmen"
                                fill
                                className="object-cover"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="font-cinzel text-2xl md:text-4xl text-[#2D1B1B]">The Shivshakti Journey</h2>
                            <div className="w-20 h-1 bg-saffron rounded-full" />
                            <div className="font-playfair text-[#4A3737]/90 space-y-4 leading-relaxed">
                                <p>
                                    Shivshakti began as a small vision in the heart of Nagpur, born from a desire to preserve and promote the incredible handicrafts that have defined our culture for generations. What started as a modest collection of hand-woven textiles has grown into a premium lifestyle brand that brings the soul of India to homes across the globe.
                                </p>
                                <p>
                                    We believe that every piece of art tells a story. From the meticulous carving of a wooden chest to the intricate embroidery on a silk hamper, each product in our collection is a testament to the skill, patience, and passion of our master artisans.
                                </p>
                                <p>
                                    Our mission is simple: to connect the modern world with traditional craftsmanship, ensuring that these ancient skills continue to thrive while providing our customers with products that are as meaningful as they are beautiful.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 md:py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-saffron rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-magenta rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="font-cinzel text-2xl md:text-4xl text-[#2D1B1B] mb-12 md:mb-16 underline decoration-saffron/30 underline-offset-8">What We Stand For</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {[
                            {
                                icon: <ShieldCheck className="h-8 w-8" />,
                                title: "Authentic Quality",
                                description: "We source only the finest materials and work directly with verified master artisans to ensure every piece meets our royal standards."
                            },
                            {
                                icon: <Heart className="h-8 w-8" />,
                                title: "Handcrafted Love",
                                description: "Machine-made can't match the soul of a handmade product. Every gift from Shivshakti carries the warmth of human touch."
                            },
                            {
                                icon: <Users className="h-8 w-8" />,
                                title: "Empowering Communities",
                                description: "By working with local artisan clusters, we provide sustainable livelihoods and help keep traditional crafts alive for future generations."
                            }
                        ].map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="p-8 rounded-2xl bg-[#FEFBF5] border border-orange-100 shadow-sm hover:shadow-md transition-shadow group"
                            >
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-saffron group-hover:scale-110 transition-transform shadow-inner">
                                    {v.icon}
                                </div>
                                <h3 className="font-cinzel text-xl font-bold mb-4 text-[#2D1B1B]">{v.title}</h3>
                                <p className="font-playfair text-[#4A3737]/70 leading-relaxed">
                                    {v.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Artisanship Section */}
            <section className="py-16 md:py-24 bg-emerald-50/30">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-block p-3 bg-white rounded-full shadow-sm text-emerald-600 mb-4"
                        >
                            <Sparkles className="h-6 w-6" />
                        </motion.div>
                        <h2 className="font-cinzel text-2xl md:text-5xl text-[#2D1B1B]">Curating Excellence</h2>
                        <p className="font-playfair text-lg md:text-xl text-[#4A3737]/80 leading-relaxed italic px-4">
                            "True luxury consists of things that cannot be mass produced. It is the imperfection of the human hand that makes a piece perfect."
                        </p>
                        <div className="pt-8">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-8 md:px-10 py-3 md:py-4 bg-[#2D1B1B] text-white font-bold tracking-widest uppercase rounded-full hover:bg-black transition-all shadow-lg hover:shadow-gray-300 text-sm md:text-base"
                            >
                                Shop Collections <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
