import { createServiceRoleClient } from '@/utils/supabase/service-role'
import HomeClient from '@/components/home-client'
import { Product } from '@/data/products'

export const dynamic = 'force-dynamic'

async function getProducts() {
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('product')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return (data || []) as Product[]
}

export default async function Home() {
  const products = await getProducts()

  return <HomeClient products={products} />
}
