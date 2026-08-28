'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Mail, Phone, MapPin, MessageSquareHeart } from 'lucide-react'
import FeedbackDialog from '@/components/feedback-dialog'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-[#F8F8F8] border-t border-[#EBEBEB]">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Feedback CTA — first thing in the footer, on a warm tint so it reads as
                    an invitation instead of disappearing into the grey link columns. */}
                <div className="mt-8 rounded-2xl bg-[#EBDDC4]/50 border border-[#E0B08A]/40 px-6 py-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex w-12 h-12 rounded-full bg-white/70 items-center justify-center flex-shrink-0">
                            <MessageSquareHeart className="w-6 h-6 text-[#B8845A]" />
                        </div>
                        <div>
                            <h4 className="text-base font-semibold text-[#1A1A1A] mb-0.5">
                                How are we doing?
                            </h4>
                            <p className="text-sm text-[#4A4A4A]">
                                Tell us what you loved, or what we could do better.
                            </p>
                        </div>
                    </div>
                    <FeedbackDialog
                        triggerClassName="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm whitespace-nowrap shadow-sm"
                    />
                </div>

                {/* Main Footer */}
                <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="inline-block mb-4">
                            <div className="relative h-20 w-20">
                                <Image
                                    src="/logo.png"
                                    alt="Shivshakti"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-sm text-[#717171] leading-relaxed mb-4">
                            Premium handcrafted gift hampers and artisanal products. Made with love in Nagpur, India.
                        </p>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://www.instagram.com/shiv_shakti_provision"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-white border border-[#EBEBEB] flex items-center justify-center text-[#717171] hover:text-[#D29B6C] hover:border-[#D29B6C] transition-colors"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-[#1A1A1A] mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Shop All', href: '/products' },
                                { name: 'About Us', href: '/about' },
                                { name: 'Contact', href: '/contact' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#717171] hover:text-[#D29B6C] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h4 className="text-sm font-semibold text-[#1A1A1A] mb-4">Policies</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Shipping Policy', href: '/shipping-policy' },
                                { name: 'Return & Refund', href: '/refund-policy' },
                                { name: 'Terms & Conditions', href: '/terms-and-conditions' },
                                { name: 'Privacy Policy', href: '/privacy-policy' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#717171] hover:text-[#D29B6C] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold text-[#1A1A1A] mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="mailto:shivshaktiprovision18@gmail.com"
                                    className="flex items-start gap-3 text-sm text-[#717171] hover:text-[#D29B6C] transition-colors"
                                >
                                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    shivshaktiprovision18@gmail.com
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+919890379728"
                                    className="flex items-center gap-3 text-sm text-[#717171] hover:text-[#D29B6C] transition-colors"
                                >
                                    <Phone className="w-4 h-4 flex-shrink-0" />
                                    +91 98903 79728
                                </a>
                            </li>
                            <li>
                                <div className="flex items-start gap-3 text-sm text-[#717171]">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    Nagpur, Maharashtra, India
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-4 border-t border-[#EBEBEB] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[#717171]">
                        © {currentYear} Shivshakti. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-[#717171]">We accept:</span>
                        <div className="flex items-center gap-2">
                            <div className="px-2 py-1 bg-white rounded border border-[#EBEBEB] text-[10px] font-medium text-[#4A4A4A]">
                                UPI
                            </div>
                            <div className="px-2 py-1 bg-white rounded border border-[#EBEBEB] text-[10px] font-medium text-[#4A4A4A]">
                                Cards
                            </div>
                            <div className="px-2 py-1 bg-white rounded border border-[#EBEBEB] text-[10px] font-medium text-[#4A4A4A]">
                                Netbanking
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
