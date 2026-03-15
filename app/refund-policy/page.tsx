'use client'

import { motion } from 'framer-motion'
import { XCircle, AlertTriangle, HelpCircle } from 'lucide-react'

export default function RefundPolicyPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#FEFBF5] pt-24 pb-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-cinzel text-4xl font-bold text-[#2D1B1B] mb-4">No Return & No Refund Policy</h1>
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
                            <XCircle className="h-6 w-6 text-saffron" />
                            <h2 className="font-cinzel text-2xl text-[#2D1B1B]">No Returns</h2>
                        </div>
                        <p>At DedayCart, all sales are final. We do not accept returns on any products under any circumstances.</p>
                        <p>We encourage customers to carefully review product descriptions, images, and specifications before making a purchase.</p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="h-6 w-6 text-saffron" />
                            <h2 className="font-cinzel text-2xl text-[#2D1B1B]">No Refunds</h2>
                        </div>
                        <p>We do not offer refunds on any purchases under any circumstances. Once an order is placed, it cannot be cancelled or refunded.</p>
                        <p>Please ensure you are certain about your purchase before placing an order.</p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <HelpCircle className="h-6 w-6 text-saffron" />
                            <h2 className="font-cinzel text-2xl text-[#2D1B1B]">Before You Buy</h2>
                        </div>
                        <p>We recommend that you:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Carefully read the product description and specifications.</li>
                            <li>Review all product images thoroughly.</li>
                            <li>Contact us if you have any questions before placing your order.</li>
                        </ul>
                    </section>

                    <section className="bg-orange-50/50 p-6 rounded-xl border-l-4 border-orange-200">
                        <h3 className="font-bold text-[#2D1B1B] mb-2">Need Help?</h3>
                        <p className="text-sm">For any questions before making a purchase, please contact our team at dedaycartprovision18@gmail.com or call us at 9876543210.</p>
                    </section>
                </motion.div>
            </div>
        </div>
    )
}
