import { createServiceRoleClient } from '@/utils/supabase/service-role'
import ProductsClient from './products-client'

// Disable static caching - always fetch fresh data
export const dynamic = 'force-dynamic'

async function getProducts() {
    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
        .from('product')
        .select('id, name, description, price, categories, images, product_type, variations, created_at')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching products:', error)
        return []
    }

    return data || []
}

export default async function ProductsPage() {
    const products = await getProducts()

    return <ProductsClient products={products} />
}
