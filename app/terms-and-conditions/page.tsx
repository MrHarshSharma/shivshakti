import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/utils/site'
import { TermsPage } from './terms-and-conditions-client'

export const metadata: Metadata = {
    title: 'Terms & Conditions',
    description: 'The terms governing your use of the Shivshakti website and any orders placed through it.',
    alternates: { canonical: '/terms-and-conditions' },
    openGraph: {
        title: 'Terms & Conditions | Shivshakti',
        description: 'The terms governing your use of the Shivshakti website and any orders placed through it.',
        url: '/terms-and-conditions',
        type: 'website',
        images: [DEFAULT_OG_IMAGE],
    },
}

export default function Page() {
    return <TermsPage />
}
