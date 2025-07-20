import { createProduct } from '@/api/createProduct'
import { getProducts } from '@/api/getProducts'
import { queryProducts } from '@/api/queryProducts'
import { CatalogColumns } from '@/app/catalog/columns'
import { BulkDeleteDialog } from '@/components/bulk-delete-dialog'
import { CreateProductDialog } from '@/components/create-product-dialog'
import { GridPagination } from '@/components/grid-pagination'
import { ImageGalleryDialog } from '@/components/image-gallery-dialog'
import { ProductGrid } from '@/components/product-grid'
import { ThemeDropdown } from '@/components/theme-dropdown'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { useCatalogStore } from '@/store/catalog'
import type { Product } from '@/types/Product'
import type { ProductsResponse } from '@/types/ProductsResponse'
import type { RowSelectionState, SortDirection } from '@tanstack/react-table'
import { Grid3X3, RefreshCcwIcon, Table2 } from 'lucide-react'
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
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

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

  const selectedProducts = Object.keys(rowSelection)
    .map((index) => products[parseInt(index)])
    .filter(Boolean)

  const handleBulkDelete = () => {
    if (selectedProducts.length > 0) {
      setIsBulkDeleteDialogOpen(true)
    }
  }

  const handleBulkDeleteComplete = () => {
    setRowSelection({})
    toast.success(`Successfully deleted ${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''}`)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    setRowSelection({}) // Clear selection when changing pages
  }

  return (
    <div className="flex flex-col h-screen p-6 md:p-10">
      <div className="flex mb-6">
        <h1 className="scroll-m-20  text-4xl font-extrabold tracking-tight text-balance">Product Catalog</h1>
        <div className="flex-auto flex x-right space-x-2">
          {/* View toggle buttons */}
          <div className="flex y-center border rounded-lg bg-gray-50 dark:bg-gray-800 px-1">
            <Button variant={viewMode === 'table' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('table')}>
              <Table2 className="size-4" />
            </Button>
            <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')}>
              <Grid3X3 className="size-4" />
            </Button>
          </div>
          <ThemeDropdown />
          <Button variant="outline" onClick={unauthenticate}>
            Log Out
          </Button>
        </div>
      </div>
      {viewMode === 'table' ? (
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
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          sortBy={sortBy}
          sortByDirection={sortByDirection}
          onSortChange={(sortBy, sortByDirection) => {
            setSortBy(sortBy)
            setSortByDirection(sortByDirection)
          }}
          actions={
            <>
              {selectedProducts.length > 0 && (
                <Button variant="destructive" onClick={handleBulkDelete}>
                  Delete {selectedProducts.length} Selected
                </Button>
              )}
              <Button onClick={() => setIsCreateDialogOpen(true)}>Create Product</Button>
            </>
          }
        />
      ) : (
        <div className="flex flex-col flex-1 space-y-4 min-h-0">
          {/* Grid view actions */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="max-w-sm"
              />
              <Button variant="outline" onClick={handleFetch}>
                <RefreshCcwIcon className={cn(isFetching && 'animate-spin')} />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              {selectedProducts.length > 0 && (
                <Button variant="destructive" onClick={handleBulkDelete}>
                  Delete {selectedProducts.length} Selected
                </Button>
              )}
              <Button onClick={() => setIsCreateDialogOpen(true)}>Create Product</Button>
            </div>
          </div>
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0">
              <ProductGrid
                products={products}
                loading={isFetching}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                onImageClick={handleImageClick}
                className="h-full"
              />
            </div>
            <GridPagination
              page={page}
              totalCount={totalProductsCount}
              itemCount={products.length}
              onPageChange={handlePageChange}
              loading={isFetching}
            />
          </div>
        </div>
      )}
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
      <BulkDeleteDialog
        products={selectedProducts}
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
        onComplete={handleBulkDeleteComplete}
      />
    </div>
  )
}
