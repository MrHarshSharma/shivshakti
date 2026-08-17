import type { Metadata } from 'next'
import CartClient from './cart-client'

export const metadata: Metadata = {
    title: 'My Cart',
    description: 'Review the items in your Shivshakti bag before checking out.',
    // Per-customer content — nothing here is meaningful to a crawler.
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
}

export default function CartPage() {
    return <CartClient />
}
