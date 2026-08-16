import { createServiceRoleClient } from '@/utils/supabase/service-role'
import ProductsClient from './products-client'
import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/utils/site'

// Cache this page and revalidate every 60 seconds
export const revalidate = 60

export const metadata: Metadata = {
    title: 'Shop All Products',
    description: 'Browse the full Shivshakti collection — luxury gift hampers, festive rakhi gifts, artisanal decor and premium gourmet treats, handcrafted in Nagpur, Maharashtra.',
    keywords: ['gift hampers online', 'rakhi gifts', 'luxury hampers Nagpur', 'Indian handicrafts', 'corporate gifting India'],
    alternates: { canonical: '/products' },
    openGraph: {
        title: 'Shop All Products | Shivshakti',
        description: 'Luxury gift hampers, festive gifts and artisanal decor, handcrafted in Maharashtra.',
        url: '/products',
        type: 'website',
        images: [DEFAULT_OG_IMAGE],
    },
}

const PRODUCTS_PER_PAGE = 12

interface GetProductsParams {
    page: number
    category?: string
    search?: string
}

async function getProducts({ page, category, search }: GetProductsParams) {
    const supabase = createServiceRoleClient()

    // First fetch all products
    let query = supabase
        .from('product')
        .select('id, name, description, price, categories, images, product_type, variations, created_at')
        .order('created_at', { ascending: false })

    const { data: allProducts, error } = await query

    if (error) {
        console.error('Error fetching products:', error)
        return { products: [], total: 0, totalPages: 0 }
    }

    // Exclude gourmet products - they have their own dedicated page at /gourmet
    let filtered = (allProducts || []).filter(p =>
        !p.categories?.some((c: string) => c.toLowerCase() === 'gourmet')
    )

    // Apply search filter
    if (search) {
        const searchLower = search.toLowerCase()
        filtered = filtered.filter(p =>
            p.name?.toLowerCase().includes(searchLower) ||
            p.description?.toLowerCase().includes(searchLower)
        )
    }

    // Apply category filter (case-insensitive)
    if (category && category !== 'All') {
        const categoryLower = category.toLowerCase()
        filtered = filtered.filter(p =>
            p.categories?.some((c: string) => c.toLowerCase() === categoryLower)
        )
    }

    // Paginate
    const total = filtered.length
    const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE)
    const from = (page - 1) * PRODUCTS_PER_PAGE
    const products = filtered.slice(from, from + PRODUCTS_PER_PAGE)

    return {
        products,
        total,
        totalPages
    }
}

interface PageProps {
    searchParams: Promise<{ page?: string; category?: string; search?: string }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
    const params = await searchParams
    const page = Math.max(1, parseInt(params.page || '1', 10))
    const category = params.category || 'All'
    const search = params.search || ''

    const { products, total, totalPages } = await getProducts({ page, category, search })

    return (
        <ProductsClient
            products={products}
            currentPage={page}
            totalPages={totalPages}
            totalProducts={total}
            currentCategory={category}
            searchQuery={search}
        />
    )
}
