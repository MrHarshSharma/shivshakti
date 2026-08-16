import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/utils/site'
import { AboutPage } from './about-client'

export const metadata: Metadata = {
    title: 'About Us',
    description: 'The story behind Shivshakti — a Nagpur family business curating premium Indian artifacts, gourmet hampers and festive gifts, handcrafted in Maharashtra.',
    keywords: ['about Shivshakti', 'Nagpur gift shop', 'Indian heritage brand', 'Maharashtra handicrafts'],
    alternates: { canonical: '/about' },
    openGraph: {
        title: 'About Shivshakti',
        description: 'The story behind Shivshakti — a Nagpur family business curating premium Indian artifacts, gourmet hampers and festive gifts, handcrafted in Maharashtra.',
        url: '/about',
        type: 'website',
        images: [DEFAULT_OG_IMAGE],
    },
}

export default function Page() {
    return <AboutPage />
}
