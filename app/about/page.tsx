'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Heart, ShieldCheck, Users, Sparkles, ArrowRight, Award, Package, Clock } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

// Animated Counter Component
function AnimatedCounter({
    value,
    suffix = '',
    duration = 2000
}: {
    value: number
    suffix?: string
    duration?: number
}) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })

    useEffect(() => {
        if (!isInView) return

        let startTime: number
        let animationFrame: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(easeOutQuart * value))

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
            } else {
                setCount(value)
            }
        }

        animationFrame = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationFrame)
    }, [isInView, value, duration])

    const formatNumber = (num: number) => {
        if (value >= 1000 && suffix.includes('K')) {
            return Math.floor(num / 1000) + 'K'
        }
        return num.toLocaleString()
    }

    return (
        <span ref={ref}>
            {value >= 1000 && suffix.includes('K') ? formatNumber(count) : count}
            {suffix.replace('K', '')}
        </span>
    )
}

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-[#E5E5E5] pt-16 pb-16 md:pt-24 md:pb-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-4 py-2 bg-white text-[#000000] text-sm font-medium rounded-full mb-6">
                                Premium Footwear Destination
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6 leading-tight">
                                Where Style Meets <span className="text-[#000000]">Performance</span>
                            </h1>
                            <p className="text-lg md:text-xl text-[#4A4A4A] leading-relaxed">
                                Your trusted destination for authentic athletic footwear from Nike, Adidas, and Puma.
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
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#FAFAFA] to-white">
                                <Image
                                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
                                    alt="DedayCart Premium Sneakers"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-[#000000] text-white p-6 rounded-xl shadow-lg hidden md:block">
                                <p className="text-3xl font-bold">1000+</p>
                                <p className="text-sm opacity-90">Happy Customers</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-6"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">The DedayCart Story</h2>
                            <div className="w-16 h-1 bg-[#000000] rounded-full" />
                            <div className="text-[#4A4A4A] space-y-4 leading-relaxed">
                                <p>
                                    DedayCart was founded with a singular vision: to bring authentic, premium athletic footwear to sneaker enthusiasts across Canada. We believe that the right pair of shoes can transform not just your performance, but your entire day.
                                </p>
                                <p>
                                    As an authorized retailer of Nike, Adidas, and Puma, we guarantee 100% authentic products. Every sneaker in our collection is carefully selected for its quality, design, and performance capabilities. From running shoes engineered for speed to lifestyle sneakers that make a statement, we curate only the finest.
                                </p>
                                <p>
                                    Today, DedayCart stands as Toronto's trusted destination for premium sneakers. With fast shipping, easy returns, and a commitment to customer satisfaction, we're redefining the sneaker shopping experience in Canada.
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
                            { value: 1000, suffix: "+", label: "Happy Customers" },
                            { value: 12, suffix: "+", label: "Premium Styles" },
                            { value: 3, suffix: "", label: "Top Brands" },
                            { value: 100, suffix: "%", label: "Authentic Products" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <p className="text-3xl md:text-4xl font-bold text-[#000000]">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2000} />
                                </p>
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
                        <p className="text-[#717171] max-w-2xl mx-auto">Our core values define every product we stock and every customer interaction we have.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <ShieldCheck className="h-7 w-7" />,
                                title: "100% Authentic",
                                description: "As an authorized retailer, we guarantee genuine Nike, Adidas, and Puma products. Every sneaker comes with official brand authentication."
                            },
                            {
                                icon: <Heart className="h-7 w-7" />,
                                title: "Curated Selection",
                                description: "Every sneaker at DedayCart is carefully selected for quality, style, and performance. We only stock what we'd wear ourselves."
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
                                className="p-8 rounded-xl bg-[#F8F8F8] border border-[#EBEBEB] hover:border-[#000000]/20 hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 bg-[#E5E5E5] rounded-xl flex items-center justify-center mb-6 text-[#000000] group-hover:bg-[#000000] group-hover:text-white transition-colors duration-300">
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
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">Why Choose DedayCart?</h2>
                            <p className="text-[#4A4A4A] mb-8 leading-relaxed">
                                We're not just another sneaker store. We're passionate about helping you find the perfect pair that matches your style and performance needs.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { icon: <Award className="h-5 w-5" />, text: "100% authentic products from Nike, Adidas, and Puma" },
                                    { icon: <Package className="h-5 w-5" />, text: "Secure packaging with fast 2-4 day delivery" },
                                    { icon: <Clock className="h-5 w-5" />, text: "Easy 7-day returns for hassle-free shopping" },
                                    { icon: <Heart className="h-5 w-5" />, text: "Expert customer support for all your sneaker questions" },
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 bg-[#000000] text-white rounded-lg flex items-center justify-center flex-shrink-0">
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
                            className="relative aspect-[1/1] rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#FAFAFA] to-white"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600"
                                alt="Premium Sneakers Collection"
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
                            <Sparkles className="h-10 w-10 text-[#000000] mx-auto mb-6" />
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Step Into Your Best</h2>
                            <p className="text-white/70 text-lg mb-8 leading-relaxed">
                                Discover premium sneakers that combine style, comfort, and performance. Your perfect pair is waiting.
                            </p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#000000] text-white font-semibold rounded-lg hover:bg-[#000000] transition-colors"
                            >
                                Shop Now <ArrowRight className="h-5 w-5" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}
