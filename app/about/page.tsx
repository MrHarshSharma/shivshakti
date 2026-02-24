'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShieldCheck, Users, Sparkles, ArrowRight, Award, Package, Clock } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-[#FDF2F4] pt-32 pb-16 md:pt-40 md:pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-4 py-2 bg-white text-[#8B1538] text-sm font-medium rounded-full mb-6">
                                Since 1986
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6 leading-tight">
                                Our Heritage, <span className="text-[#8B1538]">Your Story</span>
                            </h1>
                            <p className="text-lg md:text-xl text-[#4A4A4A] leading-relaxed">
                                Elevated Gifting, Rooted in Tradition. A Refined Expression of Taste & Care — serving generations since 1986.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                                <Image
                                    src="/logo.png"
                                    alt="Shivshakti Heritage"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-[#8B1538] text-white p-6 rounded-xl shadow-lg hidden md:block">
                                <p className="text-3xl font-bold">38+</p>
                                <p className="text-sm opacity-90">Years of Excellence</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">The Shivshakti Journey</h2>
                            <div className="w-16 h-1 bg-[#8B1538] rounded-full" />
                            <div className="text-[#4A4A4A] space-y-4 leading-relaxed">
                                <p>
                                    Shivshakti was established in Nagpur in 1986 as a trusted provision store, built on the values of quality, consistency, and care. Over the decades, we have earned the confidence of generations through our commitment to excellence and thoughtful service.
                                </p>
                                <p>
                                    In 2008, we extended this legacy into curated gifting. What began as a natural progression soon became a defining part of our brand — premium hampers crafted with refined taste, attention to detail, and an understanding of meaningful celebrations.
                                </p>
                                <p>
                                    Today, Shiv Shakti represents elevated gifting rooted in tradition. From fine dry fruits and chocolates to thoughtfully designed hampers, every offering reflects our belief that gifting should feel personal, elegant, and timeless.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-[#F8F8F8] border-y border-[#EBEBEB]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { number: "38+", label: "Years of Trust" },
                            { number: "50K+", label: "Happy Customers" },
                            { number: "1000+", label: "Products Curated" },
                            { number: "100%", label: "Quality Assured" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <p className="text-3xl md:text-4xl font-bold text-[#8B1538]">{stat.number}</p>
                                <p className="text-[#717171] mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">What We Stand For</h2>
                        <p className="text-[#717171] max-w-2xl mx-auto">Our core values define every product we curate and every customer interaction we have.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <ShieldCheck className="h-7 w-7" />,
                                title: "Authentic Quality",
                                description: "We source only the finest materials and work directly with verified suppliers to ensure every piece meets our premium standards."
                            },
                            {
                                icon: <Heart className="h-7 w-7" />,
                                title: "Thoughtful Curation",
                                description: "Every gift from Shivshakti is carefully curated with love and attention to detail, making each moment special."
                            },
                            {
                                icon: <Users className="h-7 w-7" />,
                                title: "Customer First",
                                description: "Our customers are at the heart of everything we do. We strive to exceed expectations with every order."
                            }
                        ].map((v, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="p-8 rounded-xl bg-[#F8F8F8] border border-[#EBEBEB] hover:border-[#8B1538]/20 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-[#FDF2F4] rounded-xl flex items-center justify-center mb-6 text-[#8B1538] group-hover:bg-[#8B1538] group-hover:text-white transition-colors duration-300">
                                    {v.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">{v.title}</h3>
                                <p className="text-[#717171] leading-relaxed">
                                    {v.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-16 md:py-24 bg-[#F8F8F8]">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">Why Choose Shivshakti?</h2>
                            <p className="text-[#4A4A4A] mb-8 leading-relaxed">
                                With nearly four decades of experience, we understand what makes gifting truly special. Our commitment to quality and customer satisfaction sets us apart.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { icon: <Award className="h-5 w-5" />, text: "Premium quality products sourced from trusted suppliers" },
                                    { icon: <Package className="h-5 w-5" />, text: "Elegant packaging that makes every gift memorable" },
                                    { icon: <Clock className="h-5 w-5" />, text: "Timely delivery with careful handling" },
                                    { icon: <Heart className="h-5 w-5" />, text: "Personalized service for all your gifting needs" },
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 bg-[#8B1538] text-white rounded-lg flex items-center justify-center flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <p className="text-[#4A4A4A]">{item.text}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg"
                        >
                            <Image
                                src="/image.png"
                                alt="Premium Gift Hampers"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-[#1A1A1A]">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Sparkles className="h-10 w-10 text-[#8B1538] mx-auto mb-6" />
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Curating Excellence</h2>
                            <p className="text-white/70 text-lg mb-8 leading-relaxed">
                                Thoughtfully selected, beautifully presented, and defined by uncompromising quality in every detail.
                            </p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#8B1538] text-white font-semibold rounded-lg hover:bg-[#6B102B] transition-colors"
                            >
                                Explore Collections <ArrowRight className="h-5 w-5" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}
