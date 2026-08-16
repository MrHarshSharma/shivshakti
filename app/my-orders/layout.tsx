import type { Metadata } from 'next'

// Private, per-customer content — never index it.
export const metadata: Metadata = {
    title: 'My Orders',
    robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
    },
}

export default function MyOrdersLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
