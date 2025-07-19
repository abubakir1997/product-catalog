import type { Product } from '@/types/Product'

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}
