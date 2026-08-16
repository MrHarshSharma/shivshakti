import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/utils/site'
import { ShippingPolicyPage } from './shipping-policy-client'

export const metadata: Metadata = {
    title: 'Shipping & Delivery Policy',
    description: 'Shivshakti delivery timelines, free delivery within 5 km of our Nagpur store, and shipping charges for other areas.',
    alternates: { canonical: '/shipping-policy' },
    openGraph: {
        title: 'Shipping & Delivery Policy | Shivshakti',
        description: 'Shivshakti delivery timelines, free delivery within 5 km of our Nagpur store, and shipping charges for other areas.',
        url: '/shipping-policy',
        type: 'website',
        images: [DEFAULT_OG_IMAGE],
    },
}

export default function Page() {
    return <ShippingPolicyPage />
}
