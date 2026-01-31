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

                <div className="mx-auto lg:w-1/2 md:w-full">
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
                                        362, Wanjari Complex, Dr Ambedkar Rd, Kamal Chowk, Gurunanakpura, Balabhaupeth, Nagpur, Maharashtra 440017
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-saffron/10 rounded-full text-saffron">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#2D1B1B] mb-1">Email Support</h3>
                                    <p className="text-[#4A3737]/70">shivshaktiprovision18@gmail.com</p>
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
                </div>
            </div>
        </div>
    )
}
