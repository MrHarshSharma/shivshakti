import type { MetadataRoute } from 'next'
import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { SITE_URL } from '@/utils/site'

// Re-generate hourly so newly added products get picked up without a redeploy.
export const revalidate = 3600

const STATIC_ROUTES: Array<{ path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
    { path: '/', priority: 1.0, freq: 'daily' },
    { path: '/products', priority: 0.9, freq: 'daily' },
    { path: '/gourmet', priority: 0.9, freq: 'daily' },
    { path: '/about', priority: 0.6, freq: 'monthly' },
    { path: '/contact', priority: 0.6, freq: 'monthly' },
    { path: '/shipping-policy', priority: 0.3, freq: 'yearly' },
    { path: '/refund-policy', priority: 0.3, freq: 'yearly' },
    { path: '/privacy-policy', priority: 0.3, freq: 'yearly' },
    { path: '/terms-and-conditions', priority: 0.3, freq: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date()

    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(r => ({
        url: `${SITE_URL}${r.path}`,
        lastModified: now,
        changeFrequency: r.freq,
        priority: r.priority,
    }))

    let productEntries: MetadataRoute.Sitemap = []

    try {
        const supabase = createServiceRoleClient()
        const { data, error } = await supabase
            .from('product')
            .select('id, created_at')
            .order('created_at', { ascending: false })

        if (error) throw error

        productEntries = (data || []).map(p => ({
            url: `${SITE_URL}/product/${p.id}`,
            lastModified: p.created_at ? new Date(p.created_at) : now,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
    } catch (err) {
        // A database hiccup should degrade the sitemap to its static routes, not
        // return a 500 — an erroring sitemap is worse than a partial one.
        console.error('Sitemap: could not load products', err)
    }

    return [...staticEntries, ...productEntries]
}
