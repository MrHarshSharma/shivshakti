
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

export const metadata: Metadata = {
  title: 'Shivshakti | Heritage & Luxury',
  description: 'Curated collection of premium Indian artifacts and textiles.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${cinzel.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <main>
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

