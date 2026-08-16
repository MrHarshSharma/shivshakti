import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/utils/site'
import { PrivacyPolicyPage } from './privacy-policy-client'

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'How Shivshakti collects, uses and protects your personal information when you shop with us.',
    alternates: { canonical: '/privacy-policy' },
    openGraph: {
        title: 'Privacy Policy | Shivshakti',
        description: 'How Shivshakti collects, uses and protects your personal information when you shop with us.',
        url: '/privacy-policy',
        type: 'website',
        images: [DEFAULT_OG_IMAGE],
    },
}

export default function Page() {
    return <PrivacyPolicyPage />
}
