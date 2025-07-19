import { API } from '@/lib/constants'
import type { Product } from '@/types/Product'

export async function getRandomProduct(): Promise<Product> {
  const response = await fetch(`${API}/products/random`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error)
  }

  return data.product
}
