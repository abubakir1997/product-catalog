import { API } from '@/lib/constants'
import type { Product } from '@/types/Product'

export async function updateProduct(id: string, productData: Omit<Product, '_id'>): Promise<Product> {
  const response = await fetch(`${API}/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ product: productData }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error)
  }

  return data.product
}
