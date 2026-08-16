import type { Metadata } from 'next'

// Belt and braces alongside robots.txt: middleware already redirects non-admins,
// but an explicit noindex stops these URLs surfacing in search if they are ever
// linked from elsewhere.
export const metadata: Metadata = {
    title: 'Admin',
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false },
    },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
