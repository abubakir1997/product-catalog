import { ProductCard } from '@/components/product-card'
import { ScrollingShadow } from '@/components/scrolling-shadow'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import type { ProductData } from '@/store/catalog'
import type { RowSelectionState } from '@tanstack/react-table'
import { LoaderCircle } from 'lucide-react'

interface ProductGridProps {
  products: ProductData[]
  loading?: boolean
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (selection: RowSelectionState) => void
  onImageClick?: (index: number) => void
  className?: string
}

export function ProductGrid({
  products,
  loading = false,
  rowSelection = {},
  onRowSelectionChange,
  onImageClick,
  className,
}: ProductGridProps) {
  const selectedCount = Object.keys(rowSelection).length
  const allSelected = products.length > 0 && selectedCount === products.length
  const someSelected = selectedCount > 0 && selectedCount < products.length

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all products
      const newSelection: RowSelectionState = {}
      products.forEach((_, index) => {
        newSelection[index] = true
      })
      onRowSelectionChange?.(newSelection)
    } else {
      // Deselect all
      onRowSelectionChange?.({})
    }
  }

  const handleSelectProduct = (index: number, checked: boolean) => {
    const newSelection = { ...rowSelection }
    if (checked) {
      newSelection[index] = true
    } else {
      delete newSelection[index]
    }
    onRowSelectionChange?.(newSelection)
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header with select all */}
      <div className="flex items-center justify-between flex-shrink-0 mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={allSelected || (someSelected ? 'indeterminate' : false)}
            onCheckedChange={handleSelectAll}
            aria-label="Select all products"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {selectedCount > 0 ? `${selectedCount} selected` : 'Select all'}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {products.length} product{products.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Product grid */}
      <div className="relative flex-1 min-h-0">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10">
            <LoaderCircle className="animate-spin size-12 text-gray-400" />
          </div>
        )}

        <ScrollingShadow className="h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
            {products.map((product, index) => {
              const isSelected = rowSelection[index] || false

              return (
                <div key={product._id} className="relative group h-full">
                  {/* Selection checkbox */}
                  <div className="absolute top-1 right-2 z-10">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleSelectProduct(index, !!checked)}
                      className="bg-white dark:bg-gray-900 shadow-lg border-2 rounded-lg"
                      aria-label={`Select ${product.name}`}
                    />
                  </div>

                  {/* Product card */}
                  <ProductCard
                    product={product}
                    onImageClick={() => onImageClick?.(index)}
                    onClick={() => handleSelectProduct(index, !isSelected)}
                    className={cn(
                      'h-full',
                      'transition-all duration-200',
                      isSelected && 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20',
                      product.loading && 'opacity-50'
                    )}
                  />

                  {/* Loading overlay for individual product */}
                  {product.loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 rounded-lg">
                      <LoaderCircle className="animate-spin size-6 text-gray-400" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Empty state */}
          {products.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="text-lg font-medium">No products found</div>
              <div className="text-sm">Try adjusting your search or filters</div>
            </div>
          )}
        </ScrollingShadow>
      </div>
    </div>
  )
}
