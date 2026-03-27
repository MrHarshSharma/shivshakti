import { createServiceRoleClient } from '@/utils/supabase/service-role'
import GourmetClient from './gourmet-client'

// Cache this page and revalidate every 60 seconds
export const revalidate = 60

const PRODUCTS_PER_PAGE = 12

interface GetGourmetProductsParams {
    page: number
    search?: string
    sort?: 'latest' | 'oldest'
}

async function getGourmetProducts({ page, search, sort = 'latest' }: GetGourmetProductsParams) {
    const supabase = createServiceRoleClient()

    // Fetch all products
    let query = supabase
        .from('product')
        .select('id, name, description, price, categories, images, product_type, variations, created_at')
        .order('created_at', { ascending: sort === 'oldest' })

    const { data: allProducts, error } = await query

    if (error) {
        console.error('Error fetching gourmet products:', error)
        return { products: [], total: 0, totalPages: 0 }
    }

    // Filter only gourmet products
    let filtered = (allProducts || []).filter(p =>
        p.categories?.some((c: string) => c.toLowerCase() === 'gourmet')
    )

    // Apply search filter
    if (search) {
        const searchLower = search.toLowerCase()
        filtered = filtered.filter(p =>
            p.name?.toLowerCase().includes(searchLower) ||
            p.description?.toLowerCase().includes(searchLower)
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
    searchParams: Promise<{ page?: string; search?: string; sort?: 'latest' | 'oldest' }>
}

export default async function GourmetPage({ searchParams }: PageProps) {
    const params = await searchParams
    const page = Math.max(1, parseInt(params.page || '1', 10))
    const search = params.search || ''
    const sort = params.sort || 'latest'

    const { products, total, totalPages } = await getGourmetProducts({ page, search, sort })

    return (
        <GourmetClient
            products={products}
            currentPage={page}
            totalPages={totalPages}
            totalProducts={total}
            searchQuery={search}
            currentSort={sort}
        />
    )
}
