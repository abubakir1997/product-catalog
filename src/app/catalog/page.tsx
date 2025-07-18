import { CatalogColumns } from '@/app/catalog/columns'
import { DataTable } from '@/components/ui/data-table'
import { getProducts } from '@/mock-api/getProducts'
import { queryProducts } from '@/mock-api/queryProducts'
import { useCatalogStore } from '@/store/catalog'
import type { SortDirection } from '@tanstack/react-table'
import { useCallback, useEffect, useState } from 'react'

export function CatalogPage() {
  const [isFetching, setFetching] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [sortBy, setSortBy] = useState<string>('sku')
  const [sortByDirection, setSortByDirection] = useState<SortDirection>('asc')

  const products = useCatalogStore((state) => state.products)
  const setProducts = useCatalogStore((state) => state.setProducts)

  const handleFetch = useCallback(() => {
    setFetching(true)

    if (query.trim()) {
      queryProducts(query, page)
        .then(setProducts)
        .finally(() => setFetching(false))
    } else {
      getProducts(sortBy, sortByDirection, page)
        .then(setProducts)
        .finally(() => setFetching(false))
    }
  }, [query, sortBy, sortByDirection, page])

  useEffect(() => {
    handleFetch()
  }, [handleFetch])

  return (
    <div className="flex flex-col space-y-4 p-6 md:p-10">
      <h1 className="scroll-m-20  text-4xl font-extrabold tracking-tight text-balance">Product Catalog</h1>
      <DataTable
        className="table-fixed"
        loading={isFetching}
        columns={CatalogColumns}
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
