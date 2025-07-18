import { MOCK_API, PAGINATION_LIMIT } from '@/lib/constants'
import type { DummyProductsResponse } from '@/types/DummProductsResponse'
import type { Product } from '@/types/Product'

export async function queryProducts(query: string, page: number = 0): Promise<Product[]> {
  const response = await fetch(
    `${MOCK_API}/products/search?q=${query}&limit=${PAGINATION_LIMIT}&skip=${page * PAGINATION_LIMIT}`
  )
  const data: DummyProductsResponse = await response.json()

  return data.products.map(
    (product) =>
      ({
        category: product.category,
        description: product.description,
        id: product.id + '',
        name: product.title,
        brand: product.brand,
        sku: product.sku,
        image: product.images[0],
      }) satisfies Product
  )
}
