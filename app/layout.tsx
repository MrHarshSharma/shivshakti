
import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cinzel } from 'next/font/google'
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
  title: 'DedayCart | Premium Sneakers & Athletic Footwear',
  description: 'Shop the latest Nike, Adidas, and Puma sneakers at DedayCart. Premium athletic footwear with fast delivery.',
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
      <body className="antialiased flex flex-col min-h-screen" suppressHydrationWarning>
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
      </body>
    </html>
  )
}

