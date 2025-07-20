import { API } from '@/lib/constants'
import type { Product } from '@/types/Product'

export async function bulkDeleteProducts(ids: string[]): Promise<Product[]> {
  const response = await fetch(`${API}/products/bulk-delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete products')
  }

  return data.products
}
