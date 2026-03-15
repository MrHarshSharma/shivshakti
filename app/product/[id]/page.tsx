import { notFound } from 'next/navigation'
import type { Metadata, ResolvingMetadata } from 'next'
import ProductDetails from './product-details'
import { getProductById } from '@/data/products'

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>
}

function getProduct(id: string) {
    if (!id || id === 'undefined') return null
    return getProductById(id) || null
}

export async function generateMetadata(
    { params }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params
    const product = getProduct(id)

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
        openGraph: {
            title: product.name,
            description: metaDescription,
            images: [mainImage, ...previousImages],
        },
    }
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params
    const product = getProduct(id)

    if (!product) {
        notFound()
    }

    return <ProductDetails product={product} />
}
