import type { Product } from '@/types/Product'
import { create } from 'zustand'

export interface ProductData extends Product {
  loading: boolean
}

export interface CatalogState {
  products: ProductData[]

  setProducts: (nextProducts: Product[]) => void
  appendProducts: (addedProducts: Product[]) => void
  addProduct: (product: Product) => void
  updateProduct: (product: Product) => void

  removeProduct: (productId: string) => void

  startProductLoading: (productId: string) => void
  stopProductLoading: (productId: string) => void
}

export const useCatalogStore = create<CatalogState>()((set) => ({
  products: [],

  setProducts(nextProducts) {
    set({
      products: nextProducts.map((product) => ({ ...product, loading: false })),
    })
  },
  appendProducts(addedProducts) {
    set((state) => ({
      products: [...state.products, ...addedProducts.map((product) => ({ ...product, loading: false }))],
    }))
  },
  addProduct(product) {
    set((state) => ({
      products: [{ ...product, loading: false }, ...state.products],
    }))
  },
  updateProduct(product) {
    set((state) => ({
      products: state.products.map((p) => (p._id === product._id ? { ...product, loading: false } : p)),
    }))
  },
  removeProduct(removeProductId) {
    set((state) => ({
      products: state.products.filter((product) => product._id !== removeProductId),
    }))
  },
  startProductLoading(productId) {
    set((state) => ({
      products: state.products.map((product) => (product._id === productId ? { ...product, loading: true } : product)),
    }))
  },
  stopProductLoading(productId) {
    set((state) => ({
      products: state.products.map((product) => (product._id === productId ? { ...product, loading: false } : product)),
    }))
  },
}))
