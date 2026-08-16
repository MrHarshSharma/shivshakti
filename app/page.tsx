import { createServiceRoleClient } from '@/utils/supabase/service-role'
import HomeClient from '@/components/home-client'
import { Product } from '@/data/products'
import type { Metadata } from 'next'
import { SITE_URL, absoluteUrl } from '@/utils/site'

// ISR: Revalidate every 5 minutes - page is cached and served instantly from edge
export const revalidate = 300

export const metadata: Metadata = {
  // `absolute` opts out of the layout's "%s | Shivshakti" template, since this
  // title already carries the brand.
  title: { absolute: 'Shivshakti | Heritage Indian Artifacts & Luxury Hampers' },
  description: 'Discover authentic Indian heritage with Shivshakti. Curated luxury hampers, artisanal decor, and premium gifts handcrafted in Maharashtra.',
  keywords: ['Indian luxury artifacts', 'heritage gifts', 'premium hampers', 'Nagpur', 'Maharashtra handicrafts', 'corporate gifting', 'Shivshakti'],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Shivshakti | Indian Heritage & Luxury Gifting',
    description: 'Authentic handcrafted artifacts and premium gourmet hampers from Maharashtra.',
    // Relative — resolved against metadataBase so it always tracks the live domain.
    url: '/',
    siteName: 'Shivshakti',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/hero-hamper.png',
        width: 1200,
        height: 630,
        alt: 'Shivshakti Luxury Hamper',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shivshakti | Heritage & Luxury',
    description: 'Curated premium Indian artifacts and luxury hampers.',
    images: ['/hero-hamper.png'],
  },
}

async function getProducts() {
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('product')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return (data || []) as Product[]
}

export default async function Home() {
  const products = await getProducts()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Shivshakti Heritage & Luxury',
    url: SITE_URL,
    logo: absoluteUrl('/icon.png'),
    description: 'Curated collection of premium Indian artifacts and textiles.',
    sameAs: [
      'https://instagram.com/shivshakti',
      'https://facebook.com/shivshakti',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      // E.164 — schema.org consumers expect the country code.
      telephone: '+919890379728',
      contactType: 'customer service',
      email: 'shivshaktiprovision18@gmail.com',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient products={products} />
    </>
  )
}
