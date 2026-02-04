import type { Metadata } from 'next'
import ContactClient from './contact-client'

export const metadata: Metadata = {
    title: 'Contact Us | Shivshakti Heritage & Luxury',
    description: 'Get in touch with Shivshakti for inquiries about our premium Indian artifacts, textiles, and shipping. Visit our Nagpur studio or contact us online.',
    openGraph: {
        title: 'Contact Shivshakti | Heritage & Luxury Studio',
        description: 'Visit our Nagpur studio or contact us for inquiries about heritage artifacts and premium gifting.',
        url: 'https://shivshakti.vercel.app/contact',
        siteName: 'Shivshakti',
        locale: 'en_IN',
        type: 'website',
    },
}

export default function ContactPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: 'Shivshakti Heritage',
        image: 'https://shivshakti.vercel.app/icon.png',
        '@id': 'https://shivshakti.vercel.app',
        url: 'https://shivshakti.vercel.app/contact',
        telephone: '+919028937543',
        priceRange: '₹₹₹',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Shivshakti Heritage Studio',
            addressLocality: 'Nagpur',
            addressRegion: 'Maharashtra',
            postalCode: '440001',
            addressCountry: 'IN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 26.9124,
            longitude: 75.7873,
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
            telephone: '+919028937543',
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
