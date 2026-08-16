import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/utils/site'
import { RefundPolicyPage } from './refund-policy-client'

export const metadata: Metadata = {
    title: 'Refund & Cancellation Policy',
    description: 'Shivshakti refund, return and cancellation terms — including damaged-in-transit claims and how to raise them.',
    alternates: { canonical: '/refund-policy' },
    openGraph: {
        title: 'Refund & Cancellation Policy | Shivshakti',
        description: 'Shivshakti refund, return and cancellation terms — including damaged-in-transit claims and how to raise them.',
        url: '/refund-policy',
        type: 'website',
        images: [DEFAULT_OG_IMAGE],
    },
}

export default function Page() {
    return <RefundPolicyPage />
}
