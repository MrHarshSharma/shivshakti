// Single source of truth for the public origin.
//
// Used by metadataBase, canonical URLs, the sitemap and robots.txt. Hard-coding the
// domain in each metadata block is how og:url ended up pointing at an old Vercel
// deployment, so everything reads from here instead.
export const SITE_URL = (
    process.env.NEXT_PUBLIC_APP_URL || 'https://shivshaktiprovision.com'
).replace(/\/$/, '')

export const SITE_NAME = 'Shivshakti'

// Next.js shallow-merges metadata: a page that declares `openGraph` replaces the
// layout's block outright rather than merging into it. So any page setting its own
// openGraph must restate the image, or the social preview comes out empty.
// Must be a real 1200x630 file: the previous image was a 1024x1024 square that
// merely *claimed* these dimensions, so every social preview cropped it badly.
export const DEFAULT_OG_IMAGE = {
    url: '/og-image.jpg',
    width: 1200,
    height: 630,
    type: 'image/jpeg',
    alt: 'Shivshakti luxury gift hampers',
}

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = '/'): string {
    return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}
