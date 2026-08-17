import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/utils/site'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                // Nothing here is secret — middleware already blocks these — but
                // keeping them out of the index avoids wasting crawl budget on
                // pages that only ever redirect.
                disallow: [
                    '/admin', '/admin/', '/my-orders', '/cart', '/checkout',
                    '/api/', '/auth/', '/blocked',
                ],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    }
}
