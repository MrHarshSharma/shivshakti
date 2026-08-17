import type { Metadata } from 'next'
import CheckoutClient from './checkout-client'

export const metadata: Metadata = {
    title: 'Checkout',
    description: 'Complete your Shivshakti order — choose delivery or store pickup and pay securely.',
    // A cart-specific page has nothing to offer search, and indexing it would only
    // surface a page that is empty for everyone but its owner.
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
}

export default function CheckoutPage() {
    return <CheckoutClient />
}
