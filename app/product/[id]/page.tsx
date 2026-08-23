import { createServiceRoleClient } from '@/utils/supabase/service-role'
import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'
import ProductDetails from './product-details'
import { Product } from '@/data/products'
import { absoluteUrl, SITE_NAME } from '@/utils/site'

// ISR: Revalidate every 10 minutes - product pages are cached at edge
export const revalidate = 600

interface PageProps {
    params: Promise<{ id: string }>
}

async function getProduct(id: string) {
    // If ID is undefined, return null immediately
    if (!id || id === 'undefined') return null

    const supabase = createServiceRoleClient()
    const { data: product, error } = await supabase
        .from('product')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !product) {
        return null
    }

    return product as Product
}

export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        return {
            title: 'Product Not Found',
        }
    }

    const previousImages = (await parent).openGraph?.images || []

    // Use first product image or fallback
    const mainImage = product.images?.[0] || '/placeholder-product.png'

    // Parse description if it's JSON
    let metaDescription = product.description
    try {
        const jsonDesc = JSON.parse(product.description)
        if (typeof jsonDesc === 'object' && jsonDesc !== null && jsonDesc.productDescription) {
            metaDescription = jsonDesc.productDescription
        }
    } catch {
        // Not JSON, use description as is
    }

    return {
        title: product.name,
        description: metaDescription,
        alternates: { canonical: `/product/${id}` },
        openGraph: {
            title: product.name,
            description: metaDescription,
            url: `/product/${id}`,
            type: 'website',
            images: [mainImage, ...previousImages],
        },
    }
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params
    const product = await getProduct(id)

    if (!product) {
        notFound()
    }

    // Product schema — this is what earns the price / availability snippet in
    // Google results. Variations carry their own prices, so the offer is expressed
    // as a range when they exist.
    // The shop does not track stock quantity. The `stock` field exists on variations but
    // is never maintained, and the storefront sells regardless of it, so everything is
    // always available: 0, null and NaN alike mean "still sellable", not "sold out".
    // Deliberate — don't derive this from `stock` without changing that business rule
    // first, or products go OutOfStock in search results while the site still sells them.
    const availability = 'https://schema.org/InStock'

    // Widened past the `Product` type on purpose: `price` is nullable on the product row
    // and the admin form posts strings, so what arrives here is number | string | null.
    type Variation = { price?: number | string | null }
    const variations: Variation[] = Array.isArray(product.variations) ? product.variations : []

    const variationPrices = variations
        .map(v => Number(v?.price))
        .filter(n => Number.isFinite(n) && n > 0)

    const basePrice = Number(product.price)
    const prices = variationPrices.length > 0
        ? variationPrices
        : (Number.isFinite(basePrice) && basePrice > 0 ? [basePrice] : [])

    let description = product.description
    try {
        const parsed = JSON.parse(product.description)
        if (parsed && typeof parsed === 'object' && parsed.productDescription) {
            description = parsed.productDescription
        }
    } catch {
        // plain string description
    }

    const offers = prices.length > 1
        ? {
            '@type': 'AggregateOffer',
            priceCurrency: 'INR',
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: prices.length,
            availability,
            url: absoluteUrl(`/product/${id}`),
        }
        : prices.length === 1
            ? {
                '@type': 'Offer',
                priceCurrency: 'INR',
                price: prices[0],
                availability,
                url: absoluteUrl(`/product/${id}`),
                seller: { '@type': 'Organization', name: SITE_NAME },
            }
            : undefined

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description,
        image: Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : [absoluteUrl('/placeholder-product.png')],
        sku: String(product.id),
        brand: { '@type': 'Brand', name: SITE_NAME },
        ...(offers ? { offers } : {}),
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetails product={product} />
        </>
    )
}
