import { createServiceRoleClient } from '@/utils/supabase/service-role'
import ProductsClient from './products-client'

// ISR: Revalidate every 5 minutes - page is cached and served instantly from edge
export const revalidate = 300

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
