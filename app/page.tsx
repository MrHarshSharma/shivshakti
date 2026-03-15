import HomeClient from '@/components/home-client'
import { getAllProducts } from '@/data/products'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'DedayCart | Premium Sneakers & Athletic Footwear',
  description: 'Discover the latest collection of Nike, Adidas, and Puma sneakers at DedayCart. Premium athletic footwear for running, sports, and lifestyle.',
  keywords: ['Nike shoes', 'Adidas sneakers', 'Puma footwear', 'running shoes', 'athletic shoes', 'sports shoes', 'DedayCart'],
  openGraph: {
    title: 'DedayCart | Premium Sneakers & Athletic Footwear',
    description: 'Shop the latest Nike, Adidas, and Puma sneakers. Free shipping on orders over $2000.',
    url: 'https://dedaycart.vercel.app',
    siteName: 'DedayCart',
    locale: 'en_CA',
    type: 'website',
    images: [
      {
        url: '/hero-shoes.png',
        width: 1200,
        height: 630,
        alt: 'DedayCart Premium Sneakers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DedayCart | Premium Sneakers',
    description: 'Shop Nike, Adidas, and Puma sneakers at the best prices.',
    images: ['/hero-shoes.png'],
  },
}

function getProducts() {
  return getAllProducts()
}

export default async function Home() {
  const products = await getProducts()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DedayCart',
    url: 'https://dedaycart.vercel.app',
    logo: 'https://dedaycart.vercel.app/icon.png',
    description: 'Premium sneakers and athletic footwear from top brands like Nike, Adidas, and Puma.',
    sameAs: [
      'https://instagram.com/dedaycart',
      'https://facebook.com/dedaycart',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-416-987-6543',
      contactType: 'customer service',
      email: 'support@dedaycart.com',
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
