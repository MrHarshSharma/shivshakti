'use client'

import { motion } from 'framer-motion'
import { RefreshCcw, Banknote, AlertCircle } from 'lucide-react'

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
                    <h1 className="font-cinzel text-4xl font-bold text-[#2D1B1B] mb-4">Cancellations & Refunds</h1>
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
                            <RefreshCcw className="h-6 w-6 text-saffron" />
                            <h2 className="font-cinzel text-2xl text-[#2D1B1B]">Cancellations</h2>
                        </div>
                        <p>We accept order cancellations within 24 hours of placing the order. To cancel your order, please email us at shivshaktiprovision18@gmail.com or call us at +91 99999 99999.</p>
                        <p>Once the order has been dispatched from our studio, it cannot be cancelled.</p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="h-6 w-6 text-saffron" />
                            <h2 className="font-cinzel text-2xl text-[#2D1B1B]">Returns</h2>
                        </div>
                        <p>Our heritage products are often handcrafted and unique. However, if you are not satisfied with your purchase, we offer a 7-day return policy for unused products in their original packaging.</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>The item must be in the same condition that you received it.</li>
                            <li>The item must be in its original packaging with all tags intact.</li>
                            <li>Custom-made or personalized items are not eligible for returns.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <Banknote className="h-6 w-6 text-saffron" />
                            <h2 className="font-cinzel text-2xl text-[#2D1B1B]">Refund Process</h2>
                        </div>
                        <p>Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund.</p>
                        <p>If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment (UPI) within 5-7 business days.</p>
                    </section>

                    <section className="bg-orange-50/50 p-6 rounded-xl border-l-4 border-orange-200">
                        <h3 className="font-bold text-[#2D1B1B] mb-2">Need Help?</h3>
                        <p className="text-sm">For any questions related to refunds and returns, please contact our support team at shivshaktiprovision18@gmail.com.</p>
                    </section>
                </motion.div>
            </div>
        </div>
    )
}
