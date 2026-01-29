'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'

export default function ContactClient() {
    return (
        <div className="flex flex-col min-h-screen bg-[#FEFBF5] pt-24 pb-16">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-[#2D1B1B] mb-4">Contact Us</h1>
                    <div className="w-24 h-1 bg-saffron mx-auto mb-6" />
                    <p className="font-playfair text-[#4A3737]/80 max-w-2xl mx-auto text-lg leading-relaxed">
                        We're here to assist you with any inquiries regarding our heritage collections or your orders.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="bg-white p-8 rounded-2xl border border-orange-100 shadow-sm space-y-8">
                            <h2 className="font-cinzel text-2xl text-[#2D1B1B] mb-6">Our Studio</h2>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-saffron/10 rounded-full text-saffron">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#2D1B1B] mb-1">Visit Us</h3>
                                    <p className="text-[#4A3737]/70">
                                        Shivshakti Heritage Studio<br />
                                        Nagpur, Maharashtra, 440001<br />
                                        India
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-saffron/10 rounded-full text-saffron">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#2D1B1B] mb-1">Email Support</h3>
                                    <p className="text-[#4A3737]/70">info@shivshakti.in</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-saffron/10 rounded-full text-saffron">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#2D1B1B] mb-1">Call Us</h3>
                                    <p className="text-[#4A3737]/70">+91 99999 99999</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-saffron/10 rounded-full text-saffron">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#2D1B1B] mb-1">Business Hours</h3>
                                    <p className="text-[#4A3737]/70">
                                        Monday - Saturday: 10:00 AM - 7:00 PM<br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <form className="bg-white p-8 rounded-2xl border border-orange-100 shadow-sm space-y-6">
                            <h2 className="font-cinzel text-2xl text-[#2D1B1B] mb-6">Send a Message</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#4A3737]">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl border border-orange-100 focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#4A3737]">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl border border-orange-100 focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#4A3737]">Subject</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-orange-100 focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-all"
                                    placeholder="Order Inquiry"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#4A3737]">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-orange-100 focus:border-saffron focus:ring-1 focus:ring-saffron outline-none transition-all resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <button
                                type="button"
                                className="w-full py-4 bg-[#2D1B1B] text-white font-bold tracking-widest uppercase rounded-xl hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 group"
                            >
                                Send Message
                                <Send className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
