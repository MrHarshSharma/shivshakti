import type { Metadata } from 'next'
import Link from 'next/link'
import { Compass } from 'lucide-react'

// Next emits its own `noindex` on the not-found boundary, but the root layout's
// `robots: { index: true }` is still inherited on top of it — without this override the
// page ships a contradictory `noindex` + `index, follow` pair. `follow` stays on so
// crawlers landing on a dead URL still walk the links back into the live catalogue.
export const metadata: Metadata = {
    title: 'Page Not Found',
    robots: {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
    },
}

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#FEFBF5] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-saffron/20">
                    <Compass className="h-10 w-10 text-saffron" />
                </div>
                <p className="font-cinzel text-5xl font-bold text-[#2D1B1B]/20 mb-2">404</p>
                <h1 className="font-cinzel text-3xl font-bold text-[#2D1B1B] mb-3">
                    Page Not Found
                </h1>
                <p className="text-[#4A3737]/60 mb-8">
                    The page you are looking for may have been moved, or the product is no
                    longer part of our collection.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-saffron text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-saffron/30"
                    >
                        Go to Homepage
                    </Link>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#2D1B1B]/10 text-[#2D1B1B] font-bold text-sm rounded-xl hover:border-saffron/40 hover:text-saffron transition-all"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>
        </div>
    )
}
