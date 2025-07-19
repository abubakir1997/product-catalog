import { createProduct } from '@/api/createProduct'
import { getProducts } from '@/api/getProducts'
import { queryProducts } from '@/api/queryProducts'
import { CatalogColumns } from '@/app/catalog/columns'
import { CreateProductDialog } from '@/components/create-product-dialog'
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

  const products = useCatalogStore((state) => state.products)
  const setProducts = useCatalogStore((state) => state.setProducts)
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

  const handleCreateProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const newProduct = await createProduct(productData)
      addProduct(newProduct)
    } catch (err) {
      const error = err as Error
      toast.error(error.message)
    }
  }

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
        columns={CatalogColumns}
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
    </div>
  )
}
