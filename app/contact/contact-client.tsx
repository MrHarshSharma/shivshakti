'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactClient() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-[#FDF2F4] pt-16 pb-16 md:pt-20 md:pb-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">Contact Us</h1>
                        <p className="text-[#4A4A4A] text-lg leading-relaxed">
                            We're here to assist you with any inquiries regarding our premium collections or your orders.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Visit Us Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-[#F8F8F8] rounded-xl p-8 border border-[#EBEBEB] hover:border-[#8B1538]/20 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-[#FDF2F4] rounded-xl flex items-center justify-center mb-6 text-[#8B1538]">
                                    <MapPin className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Visit Our Store</h3>
                                <p className="text-[#717171] leading-relaxed">
                                    362, Wanjari Complex, Dr Ambedkar Rd, Kamal Chowk, Gurunanakpura, Balabhaupeth, Nagpur, Maharashtra 440017
                                </p>
                            </motion.div>

                            {/* Email Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-[#F8F8F8] rounded-xl p-8 border border-[#EBEBEB] hover:border-[#8B1538]/20 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-[#FDF2F4] rounded-xl flex items-center justify-center mb-6 text-[#8B1538]">
                                    <Mail className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Email Us</h3>
                                <a
                                    href="mailto:shivshaktiprovision18@gmail.com"
                                    className="text-[#8B1538] hover:underline font-medium"
                                >
                                    shivshaktiprovision18@gmail.com
                                </a>
                                <p className="text-[#717171] mt-2 text-sm">We'll respond within 24 hours</p>
                            </motion.div>

                            {/* Phone Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="bg-[#F8F8F8] rounded-xl p-8 border border-[#EBEBEB] hover:border-[#8B1538]/20 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-[#FDF2F4] rounded-xl flex items-center justify-center mb-6 text-[#8B1538]">
                                    <Phone className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Call Us</h3>
                                <a
                                    href="tel:9890379728"
                                    className="text-[#8B1538] hover:underline font-medium text-lg"
                                >
                                    +91 98903 79728
                                </a>
                                <p className="text-[#717171] mt-2 text-sm">Mon - Sat, 10AM - 7PM</p>
                            </motion.div>

                            {/* Business Hours Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="bg-[#F8F8F8] rounded-xl p-8 border border-[#EBEBEB] hover:border-[#8B1538]/20 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-[#FDF2F4] rounded-xl flex items-center justify-center mb-6 text-[#8B1538]">
                                    <Clock className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Business Hours</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[#4A4A4A]">
                                        <span>Monday - Saturday</span>
                                        <span className="font-medium">10:00 AM - 7:00 PM</span>
                                    </div>
                                    <div className="flex justify-between text-[#717171]">
                                        <span>Sunday</span>
                                        <span>Closed</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Map or Additional Info Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-12 bg-[#1A1A1A] rounded-xl p-8 md:p-12 text-center"
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Need Custom Gifting Solutions?</h2>
                            <p className="text-white/70 mb-6 max-w-xl mx-auto">
                                For bulk orders, corporate gifting, or special customization requests, reach out to us directly. We'd love to help create something special for you.
                            </p>
                            <a
                                href="https://wa.me/919890379728"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#8B1538] text-white font-semibold rounded-lg hover:bg-[#6B102B] transition-colors"
                            >
                                Chat on WhatsApp
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}
