
import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter, Playfair_Display, Cinzel } from 'next/font/google'
import { SITE_URL, SITE_NAME, GA_MEASUREMENT_ID } from '@/utils/site'
import './globals.css'
import Navbar from '@/components/navbar'
import { CartProvider } from '@/context/cart-context'
import { AuthProvider } from '@/context/auth-context'
import CartDrawer from '@/components/cart-drawer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' })

import { Suspense } from 'react'

export const metadata: Metadata = {
  // Without metadataBase, Next resolves relative og:image paths against
  // localhost:3000 — which is exactly what shipped, breaking every social preview.
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Shivshakti | Heritage & Luxury Gifting in Nagpur',
    // Child pages set only their own title; the brand is appended here.
    template: '%s | Shivshakti',
  },
  description: 'Curated collection of premium Indian artifacts, gourmet hampers and festive gifts, handcrafted in Maharashtra.',
  applicationName: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_IN',
    url: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  }
}

import Footer from '@/components/footer'
import WhatsAppButton from '@/components/whatsapp-button'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${cinzel.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={null}>
              <Navbar />
            </Suspense>
            <Suspense fallback={null}>
              <CartDrawer />
            </Suspense>
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>

        {/* GA4. `afterInteractive` keeps the tag off the critical path — pasting raw
            <script> tags into the App Router instead would break hydration. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}

