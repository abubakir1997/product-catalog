import { getProducts } from '@/api/getProducts'
import { queryProducts } from '@/api/queryProducts'
import { CatalogColumns } from '@/app/catalog/columns'
import { ThemeDropdown } from '@/components/theme-dropdown'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useAuthStore } from '@/store/auth'
import { useCatalogStore } from '@/store/catalog'
import type { SortDirection } from '@tanstack/react-table'
import { useCallback, useEffect, useState } from 'react'

export function CatalogPage() {
  const [isFetching, setFetching] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState<string>('sku')
  const [sortByDirection, setSortByDirection] = useState<SortDirection>('asc')
  const [totalProductsCount, setTotalProductsCount] = useState<number | undefined>()

  const products = useCatalogStore((state) => state.products)
  const setProducts = useCatalogStore((state) => state.setProducts)
  const unauthenticate = useAuthStore((state) => state.unauthenticate)

  const handleFetch = useCallback(() => {
    setFetching(true)

    if (query.trim()) {
      setTotalProductsCount(undefined)

      queryProducts(query, page)
        .then(setProducts)
        .finally(() => setFetching(false))
    } else {
      getProducts(sortBy, sortByDirection, page)
        .then((data) => {
          setProducts(data.products)
          setTotalProductsCount(data.total)
        })
        .finally(() => setFetching(false))
    }
  }, [query, sortBy, sortByDirection, page])

  useEffect(() => {
    handleFetch()
  }, [handleFetch])

  return (
    <div className="flex flex-col space-y-4 p-6 md:p-10">
      <div className="flex">
        <h1 className="scroll-m-20  text-4xl font-extrabold tracking-tight text-balance">Product Catalog</h1>
        <div className="flex-auto flex x-right space-x-2">
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
    </div>
  )
}
