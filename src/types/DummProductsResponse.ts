import type { DummyProduct } from '@/types/DummyProduct'

export interface DummyProductsResponse {
  products: DummyProduct[]
  total: number
  skip: number
  limit: number
}
