'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-[#FEFBF5] border-t border-orange-100/50 pt-20 pb-12 relative overflow-hidden">
            {/* Top Accent Gradient */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-saffron/30 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-center md:text-left">
                    {/* Brand Section */}
                    <div className="space-y-8 flex flex-col items-center md:items-start">
                        <Link href="/" className="inline-block relative h-20 w-20 rounded-full overflow-hidden border border-orange-100 shadow-sm transition-transform hover:scale-105 duration-300 bg-white">
                            <Image
                                src="/image.png"
                                alt="Shivshakti Logo"
                                fill
                                className="object-contain"
                            />
                        </Link>
                        <div>
                            <h2 className="font-cinzel text-xl font-black tracking-[0.2em] text-[#2D1B1B] uppercase mb-4">Shivshakti</h2>
                            <p className="font-playfair text-sm leading-relaxed text-[#4A3737]/80 italic">
                                Curating a heritage of luxury and tradition. Our collection brings together the finest Indian artifacts and textiles.
                            </p>
                        </div>
                    </div>

                    {/* Mobile 2-Column Wrapper for Collection & Connect */}
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:contents gap-8 md:gap-12 col-span-1 md:col-span-1 lg:col-span-2">
                        {/* Quick Access */}
                        <div className="space-y-8">
                            <h3 className="font-cinzel text-[10px] font-black uppercase tracking-[0.4em] text-saffron opacity-80">Collection</h3>
                            <div className="flex flex-col gap-5 font-cinzel text-[10px] md:text-xs font-bold tracking-widest text-[#2D1B1B]">
                                <Link href="/products" className="hover:text-magenta transition-all flex items-center justify-center md:justify-start gap-2 group">
                                    <span className="h-[1px] w-0 bg-magenta group-hover:w-3 transition-all"></span>
                                    The Collection
                                </Link>
                                <Link href="/about" className="hover:text-saffron transition-all flex items-center justify-center md:justify-start gap-2 group">
                                    <span className="h-[1px] w-0 bg-saffron group-hover:w-3 transition-all"></span>
                                    Our Heritage
                                </Link>
                            </div>
                        </div>

                        {/* Reach Us */}
                        <div className="space-y-8">
                            <h3 className="font-cinzel text-[10px] font-black uppercase tracking-[0.4em] text-saffron opacity-80">Connect</h3>
                            <div className="flex flex-col gap-5 font-playfair text-sm text-[#4A3737]/80">
                                <div className="flex md:flex-row items-center justify-center md:justify-start gap-3 group cursor-default">
                                    <div className="p-2 md:p-2.5 rounded-full bg-white border border-orange-100 text-magenta group-hover:bg-magenta group-hover:text-white transition-all shadow-sm">
                                        <Mail className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                    </div>
                                    <span className="text-[11px] md:text-[13px] break-all">contact@shivshakti.com</span>
                                </div>
                                <div className="flex md:flex-row items-center justify-center md:justify-start gap-3 group cursor-default">
                                    <div className="p-2 md:p-2.5 rounded-full bg-white border border-orange-100 text-saffron group-hover:bg-saffron group-hover:text-white transition-all shadow-sm">
                                        <Phone className="h-3 w-3 md:h-3.5 md:w-3.5" />
                                    </div>
                                    <span className="text-[11px] md:text-[13px]">+91 98765 43210</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="space-y-6 lg:col-span-1">
                        <h3 className="font-cinzel text-[10px] font-black uppercase tracking-[0.4em] text-saffron opacity-80">Our Studio</h3>
                        <div className="rounded-2xl overflow-hidden border border-orange-100 shadow-sm h-40 w-full bg-white relative group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119064.90034383052!2d78.98993707584931!3d21.161225912616445!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31faf13%3A0x19b37d06d0bb3e2b!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1769253188579!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="transition-all duration-700 opacity-60 group-hover:opacity-100"
                            ></iframe>
                            {/* Overlay tag */}
                            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter text-[#2D1B1B] border border-orange-100">
                                Nagpur, Maharashtra
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-10 border-t border-orange-100/50 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <Link href="#" className="p-3 bg-white rounded-full border border-orange-50 text-[#4A3737]/40 hover:text-magenta hover:shadow-md transition-all">
                            <Instagram className="h-4 w-4" />
                        </Link>
                        <Link href="#" className="p-3 bg-white rounded-full border border-orange-50 text-[#4A3737]/40 hover:text-saffron hover:shadow-md transition-all">
                            <Facebook className="h-4 w-4" />
                        </Link>
                        <Link href="#" className="p-3 bg-white rounded-full border border-orange-50 text-[#4A3737]/40 hover:text-blue-400 hover:shadow-md transition-all">
                            <Twitter className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="text-center md:text-right space-y-2">
                        <p className="font-cinzel text-[9px] font-black text-[#2D1B1B]/40 uppercase tracking-[0.3em]">
                            &copy; {currentYear} Shivshakti Heritage Luxury
                        </p>
                        <p className="font-playfair text-[9px] text-[#4A3737]/30 italic tracking-widest uppercase">
                            Preserving tradition, one artifact at a time.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
