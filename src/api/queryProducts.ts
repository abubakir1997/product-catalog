import { API, PAGINATION_LIMIT } from '@/lib/constants'
import type { Product } from '@/types/Product'
import type { ProductsResponse } from '@/types/ProductsResponse'

export async function queryProducts(query: string, page: number = 0): Promise<Product[]> {
  const response = await fetch(
    `${API}/products/search?q=${encodeURIComponent(query)}&limit=${PAGINATION_LIMIT}&page=${page}`
  )
  const data: ProductsResponse = await response.json()

  if (!response.ok) {
    throw new Error(data.error)
  }

  return data.products
}
