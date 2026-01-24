'use client'

import { motion } from 'framer-motion'
import { Truck, Globe, Shield } from 'lucide-react'

export default function ShippingPolicyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#FEFBF5] pt-24 pb-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-cinzel text-4xl font-bold text-[#2D1B1B] mb-4">Shipping Policy</h1>
                    <div className="w-20 h-1 bg-saffron mx-auto" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white p-8 md:p-12 rounded-2xl border border-orange-100 shadow-sm space-y-10 font-playfair text-[#4A3737]/90 leading-relaxed"
                >
                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Truck className="h-6 w-6 text-saffron" />
                            <h2 className="font-cinzel text-2xl text-[#2D1B1B]">Domestic Shipping (India)</h2>
                        </div>
                        <p>At Shivshakti, we understand the importance of receiving your heritage collections safely and promptly.</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Standard Delivery:</strong> 5-7 business days.</li>
                            <li><strong>Express Delivery:</strong> 2-3 business days (available at extra cost in select cities).</li>
                            <li><strong>Free Shipping:</strong> Enjoy free standard shipping on all orders above ₹4,999.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Globe className="h-6 w-6 text-saffron" />
                            <h2 className="font-cinzel text-2xl text-[#2D1B1B]">International Shipping</h2>
                        </div>
                        <p>We take pride in sharing Indian craftsmanship globally. International delivery typically takes 10-15 business days depending on the destination and customs processes.</p>
                        <p className="text-sm italic">Note: International shipping charges and custom duties are borne by the customer.</p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="h-6 w-6 text-saffron" />
                            <h2 className="font-cinzel text-2xl text-[#2D1B1B]">Order Processing</h2>
                        </div>
                        <p>Once your order is placed, it undergoes a meticulous quality check and premium packaging process. This usually takes 1-2 business days.</p>
                        <p>As soon as your order is dispatched, you will receive a tracking link via email and SMS to monitor its journey to your doorstep.</p>
                    </section>

                    <section className="bg-[#FEFBF5] p-6 rounded-xl border-l-4 border-saffron">
                        <h3 className="font-bold text-[#2D1B1B] mb-2">Damaged in Transit?</h3>
                        <p className="text-sm">While we take extreme care in packaging, if your product arrives damaged, please notify us within 24 hours of delivery with photographic evidence. We will arrange a replacement or refund promptly.</p>
                    </section>
                </motion.div>
            </div>
        </div>
    )
}
