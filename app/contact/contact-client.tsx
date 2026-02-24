'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactClient() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-[#EBDDC4] pt-16 pb-16 md:pt-20 md:pb-20">
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
                                className="bg-[#F8F8F8] rounded-xl p-8 border border-[#EBEBEB] hover:border-[#D29B6C]/20 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-[#EBDDC4] rounded-xl flex items-center justify-center mb-6 text-[#D29B6C]">
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
                                className="bg-[#F8F8F8] rounded-xl p-8 border border-[#EBEBEB] hover:border-[#D29B6C]/20 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-[#EBDDC4] rounded-xl flex items-center justify-center mb-6 text-[#D29B6C]">
                                    <Mail className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Email Us</h3>
                                <a
                                    href="mailto:shivshaktiprovision18@gmail.com"
                                    className="text-[#D29B6C] hover:underline font-medium"
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
                                className="bg-[#F8F8F8] rounded-xl p-8 border border-[#EBEBEB] hover:border-[#D29B6C]/20 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-[#EBDDC4] rounded-xl flex items-center justify-center mb-6 text-[#D29B6C]">
                                    <Phone className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Call Us</h3>
                                <a
                                    href="tel:9890379728"
                                    className="text-[#D29B6C] hover:underline font-medium text-lg"
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
                                className="bg-[#F8F8F8] rounded-xl p-8 border border-[#EBEBEB] hover:border-[#D29B6C]/20 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-[#EBDDC4] rounded-xl flex items-center justify-center mb-6 text-[#D29B6C]">
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

                        {/* WhatsApp CTA Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-12 bg-[#EBDDC4] rounded-xl p-8 md:p-12 text-center relative overflow-hidden"
                        >
                            {/* Decorative elements */}
                            <div className="absolute top-0 left-0 w-32 h-32 bg-[#D29B6C]/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#D29B6C]/10 rounded-full translate-x-1/3 translate-y-1/3" />

                            <div className="relative z-10">

                                <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-4">Need Custom Gifting Solutions?</h2>
                                <p className="text-[#4A4A4A] mb-6 max-w-xl mx-auto">
                                    For bulk orders, corporate gifting, or special customization requests, reach out to us directly. We'd love to help create something special for you.
                                </p>
                                <a
                                    href="https://wa.me/919890379728"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#1EBE5D] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}
