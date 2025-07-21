import { Button } from '@/components/ui/button'
import { PAGINATION_LIMIT } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  className?: string
  page: number
  totalCount?: number
  itemCount: number
  loading?: boolean
  onPageChange?: (page: number) => void
}

export function Pagination({ className, page, totalCount, itemCount, loading = false, onPageChange }: PaginationProps) {
  const startItem = page * PAGINATION_LIMIT + 1
  const endItem = page * PAGINATION_LIMIT + itemCount
  const hasNextPage = totalCount ? endItem < totalCount : itemCount === PAGINATION_LIMIT
  const hasPrevPage = page > 0

  const totalPages = totalCount ? Math.ceil(totalCount / PAGINATION_LIMIT) : undefined

  return (
    <div
      className={cn('flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-700', className)}>
      {/* Items info */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <span>
          <span className="hidden sm:inline">Showing</span> {startItem}-{endItem}
          {totalCount && ` of ${totalCount}`} <span className="hidden sm:inline">items</span>
        </span>
        {totalPages && (
          <span className="text-gray-400 hidden sm:inline">
            • Page {page + 1} of {totalPages}
          </span>
        )}
      </div>

      {/* Navigation controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(page - 1)}
          disabled={!hasPrevPage || loading}
          className="h-8">
          <ChevronLeft className="size-4" />
          Previous
        </Button>

        {/* Page numbers for small pagination */}
        {totalPages && totalPages <= 10 && (
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={i === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange?.(i)}
                disabled={loading}
                className={cn('h-8 w-8 p-0', i === page && 'bg-blue-600 hover:bg-blue-700')}>
                {i + 1}
              </Button>
            ))}
          </div>
        )}

        {/* Page numbers for large pagination */}
        {totalPages && totalPages > 10 && (
          <div className="flex items-center space-x-1">
            {/* First page */}
            {page > 2 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(0)}
                  disabled={loading}
                  className="h-8 w-8 p-0">
                  1
                </Button>
                {page > 3 && <span className="text-gray-400">...</span>}
              </>
            )}

            {/* Current page range */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(0, Math.min(totalPages - 5, page - 2)) + i
              if (pageNum >= totalPages) return null

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange?.(pageNum)}
                  disabled={loading}
                  className={cn('h-8 w-8 p-0', pageNum === page && 'bg-blue-600 hover:bg-blue-700')}>
                  {pageNum + 1}
                </Button>
              )
            })}

            {/* Last page */}
            {page < totalPages - 3 && (
              <>
                {page < totalPages - 4 && <span className="text-gray-400">...</span>}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange?.(totalPages - 1)}
                  disabled={loading}
                  className="h-8 w-8 p-0">
                  {totalPages}
                </Button>
              </>
            )}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange?.(page + 1)}
          disabled={!hasNextPage || loading}
          className="h-8">
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
