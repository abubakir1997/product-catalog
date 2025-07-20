import { createProduct } from '@/api/createProduct'
import { getProducts } from '@/api/getProducts'
import { queryProducts } from '@/api/queryProducts'
import { CatalogColumns } from '@/app/catalog/columns'
import { CreateProductDialog } from '@/components/create-product-dialog'
import { ImageGalleryDialog } from '@/components/image-gallery-dialog'
import { ThemeDropdown } from '@/components/theme-dropdown'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useAuthStore } from '@/store/auth'
import { useCatalogStore } from '@/store/catalog'
import type { Product } from '@/types/Product'
import type { ProductsResponse } from '@/types/ProductsResponse'
import type { SortDirection } from '@tanstack/react-table'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export function CatalogPage() {
  const [isFetching, setFetching] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState<string>('sku')
  const [sortByDirection, setSortByDirection] = useState<SortDirection>('asc')
  const [totalProductsCount, setTotalProductsCount] = useState<number | undefined>()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0)
  const [isLoadingMoreForGallery, setIsLoadingMoreForGallery] = useState(false)

  const products = useCatalogStore((state) => state.products)
  const setProducts = useCatalogStore((state) => state.setProducts)
  const appendProducts = useCatalogStore((state) => state.appendProducts)
  const addProduct = useCatalogStore((state) => state.addProduct)
  const unauthenticate = useAuthStore((state) => state.unauthenticate)

  const handleFetchProducts = useCallback((data: ProductsResponse) => {
    setProducts(data.products)
    setTotalProductsCount(data.total)
  }, [])

  const handleFetch = useCallback(() => {
    setFetching(true)

    if (query.trim()) {
      setTotalProductsCount(undefined)

      queryProducts(query, page)
        .then(setProducts)
        .catch(toast.error)
        .finally(() => setFetching(false))
    } else {
      getProducts(sortBy, sortByDirection, page)
        .then(handleFetchProducts)
        .catch(toast.error)
        .finally(() => setFetching(false))
    }
  }, [query, sortBy, sortByDirection, page, handleFetchProducts])

  useEffect(() => {
    handleFetch()
  }, [handleFetch])

  const handleCreateProduct = async (productData: Omit<Product, '_id'>) => {
    try {
      const newProduct = await createProduct(productData)
      addProduct(newProduct)
    } catch (err) {
      const error = err as Error
      toast.error(error.message)
    }
  }

  const handleImageClick = (productIndex: number) => {
    setGalleryInitialIndex(productIndex)
    setIsGalleryOpen(true)
  }

  const handleLoadNextPage = async () => {
    if (query.trim() || isLoadingMoreForGallery) return

    setIsLoadingMoreForGallery(true)
    try {
      const nextPage = Math.floor(products.length / 10)
      const data = await getProducts(sortBy, sortByDirection, nextPage)
      appendProducts(data.products)
      setTotalProductsCount(data.total)
    } catch (err) {
      const error = err as Error
      toast.error(error.message)
    } finally {
      setIsLoadingMoreForGallery(false)
    }
  }

  const hasMorePages = totalProductsCount ? products.length < totalProductsCount : false

  return (
    <div className="flex flex-col space-y-4 p-6 md:p-10">
      <div className="flex">
        <h1 className="scroll-m-20  text-4xl font-extrabold tracking-tight text-balance">Product Catalog</h1>
        <div className="flex-auto flex x-right space-x-2">
          <Button onClick={() => setIsCreateDialogOpen(true)}>Create Product</Button>
          <ThemeDropdown />
          <Button variant="outline" onClick={unauthenticate}>
            Log Out
          </Button>
        </div>
      </div>
      <DataTable
        className="table-fixed"
        loading={isFetching}
        columns={CatalogColumns(handleImageClick)}
        totalDataCount={totalProductsCount}
        data={products}
        onRefresh={handleFetch}
        query={query}
        onQueryChange={setQuery}
        page={page}
        onPageChange={setPage}
        sortBy={sortBy}
        sortByDirection={sortByDirection}
        onSortChange={(sortBy, sortByDirection) => {
          setSortBy(sortBy)
          setSortByDirection(sortByDirection)
        }}
      />
      <CreateProductDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateProduct={handleCreateProduct}
      />
      <ImageGalleryDialog
        open={isGalleryOpen}
        onOpenChange={setIsGalleryOpen}
        products={products}
        initialProductIndex={galleryInitialIndex}
        onLoadNextPage={handleLoadNextPage}
        hasMorePages={hasMorePages}
        isLoadingMore={isLoadingMoreForGallery}
      />
    </div>
  )
}
