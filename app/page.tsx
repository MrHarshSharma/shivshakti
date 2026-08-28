import { createServiceRoleClient } from '@/utils/supabase/service-role'
import HomeClient from '@/components/home-client'
import { Product } from '@/data/products'
import type { Metadata } from 'next'
import { SITE_URL, absoluteUrl, DEFAULT_OG_IMAGE } from '@/utils/site'

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
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shivshakti | Heritage & Luxury',
    description: 'Curated premium Indian artifacts and luxury hampers.',
    images: [DEFAULT_OG_IMAGE.url],
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

async function getPublishedFeedback() {
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('feedback')
    .select('id, name, rating, message, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    // A missing or unreachable feedback table must not take the homepage down —
    // the widget simply renders nothing.
    console.error('Error fetching published feedback:', error)
    return []
  }

  return data || []
}

export default async function Home() {
  const [products, reviews] = await Promise.all([getProducts(), getPublishedFeedback()])

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
      <HomeClient products={products} reviews={reviews} />
    </>
  )
}
