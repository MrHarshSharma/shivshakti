import type { Metadata } from 'next'
import ContactClient from './contact-client'

export const metadata: Metadata = {
    title: 'Contact Us | DedayCart Premium Sneakers',
    description: 'Get in touch with DedayCart for inquiries about our premium Nike, Adidas, and Puma sneakers. Visit our Toronto store or contact us online.',
    openGraph: {
        title: 'Contact DedayCart | Premium Sneaker Store',
        description: 'Visit our Toronto store or contact us for inquiries about authentic athletic footwear.',
        url: 'https://dedaycart.vercel.app/contact',
        siteName: 'DedayCart',
        locale: 'en_CA',
        type: 'website',
    },
}

export default function ContactPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: 'DedayCart Premium Sneakers',
        image: 'https://dedaycart.vercel.app/icon.png',
        '@id': 'https://dedaycart.vercel.app',
        url: 'https://dedaycart.vercel.app/contact',
        telephone: '+1-416-987-6543',
        priceRange: '$$$',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Queen Street West',
            addressLocality: 'Toronto',
            addressRegion: 'Ontario',
            postalCode: 'M5H 2M9',
            addressCountry: 'CA',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 43.6532,
            longitude: -79.3832,
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
            telephone: '+1-416-987-6543',
            contactType: 'customer service',
            email: 'support@dedaycart.com',
            areaServed: 'CA',
            availableLanguage: ['en', 'fr'],
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
