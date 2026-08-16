import type { Metadata } from 'next'
import ContactClient from './contact-client'
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_URL } from '@/utils/site'
import { STORE_LOCATION } from '@/utils/delivery'

export const metadata: Metadata = {
    // `absolute` — this title already carries the brand, so skip the layout template.
    title: { absolute: 'Contact Us | Shivshakti Heritage & Luxury' },
    description: 'Get in touch with Shivshakti for inquiries about our premium Indian artifacts, textiles, and shipping. Visit our Nagpur store or contact us online.',
    alternates: { canonical: '/contact' },
    openGraph: {
        title: 'Contact Shivshakti | Heritage & Luxury Store',
        description: 'Visit our Nagpur store or contact us for inquiries about heritage artifacts and premium gifting.',
        url: '/contact',
        siteName: 'Shivshakti',
        locale: 'en_IN',
        type: 'website',
        images: [DEFAULT_OG_IMAGE],
    },
}

export default function ContactPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: 'Shivshakti Heritage',
        image: absoluteUrl('/icon.png'),
        '@id': SITE_URL,
        url: absoluteUrl('/contact'),
        telephone: '+919890379728',
        priceRange: '₹₹₹',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '362, Wanjari Complex, Dr Ambedkar Rd, Kamal Chowk, Gurunanakpura, Balabhaupeth',
            addressLocality: 'Nagpur',
            addressRegion: 'Maharashtra',
            postalCode: '440017',
            addressCountry: 'IN',
        },
        // Shared with the delivery-radius calculation so the shop only has one set
        // of coordinates. The previous values pointed at Jaipur.
        geo: {
            '@type': 'GeoCoordinates',
            latitude: STORE_LOCATION.lat,
            longitude: STORE_LOCATION.lng,
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                ],
                opens: '10:00',
                closes: '19:00',
            },
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '9890379728',
            contactType: 'customer service',
            email: 'shivshaktiprovision18@gmail.com',
            areaServed: 'IN',
            availableLanguage: ['en', 'hi'],
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ContactClient />
        </>
    )
}
