import { API, PAGINATION_LIMIT } from '@/lib/constants'
import type { ProductsResponse } from '@/types/ProductsResponse'
import type { SortDirection } from '@tanstack/react-table'

export async function getProducts(
  sortBy: string,
  sortByDirection: SortDirection,
  page: number = 0
): Promise<ProductsResponse> {
  const response = await fetch(
    `${API}/products?sortBy=${sortBy}&sortByDirection=${sortByDirection}&limit=${PAGINATION_LIMIT}&page=${page}`
  )
  const data: ProductsResponse = await response.json()

  if (!response.ok) {
    throw new Error(data.error)
  }

  return data
}
