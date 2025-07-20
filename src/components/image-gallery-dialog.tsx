import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import type { ProductData } from '@/store/catalog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface ImageGalleryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: ProductData[]
  initialProductIndex: number
  onLoadNextPage?: () => Promise<void>
  hasMorePages?: boolean
  isLoadingMore?: boolean
}

export function ImageGalleryDialog({
  open,
  onOpenChange,
  products,
  initialProductIndex,
  onLoadNextPage,
  hasMorePages = false,
  isLoadingMore = false,
}: ImageGalleryDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(initialProductIndex)

  useEffect(() => {
    if (open) {
      setCurrentIndex(initialProductIndex)
    }
  }, [open, initialProductIndex])

  const currentProduct = products[currentIndex]
  const isFirstImage = currentIndex === 0
  const isLastImage = currentIndex === products.length - 1
  const canGoNext = !isLastImage || (hasMorePages && !isLoadingMore)
  const canGoPrev = !isFirstImage

  const handlePrevious = useCallback(() => {
    if (canGoPrev) {
      setCurrentIndex(currentIndex - 1)
    }
  }, [canGoPrev, currentIndex])

  const handleNext = useCallback(async () => {
    if (isLastImage && hasMorePages && onLoadNextPage && !isLoadingMore) {
      await onLoadNextPage()
      setCurrentIndex(currentIndex + 1)
    } else if (!isLastImage) {
      setCurrentIndex(currentIndex + 1)
    }
  }, [isLastImage, hasMorePages, onLoadNextPage, isLoadingMore, currentIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open) return

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          handlePrevious()
          break
        case 'ArrowRight':
          event.preventDefault()
          handleNext()
          break
        case 'Escape':
          event.preventDefault()
          onOpenChange(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, handlePrevious, handleNext, onOpenChange])

  if (!currentProduct) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[60vw] max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        <div className="relative flex flex-center bg-black min-h-[60vh]">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={() => onOpenChange(false)}>
            <X className="size-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 disabled:opacity-30"
            onClick={handlePrevious}
            disabled={!canGoPrev}>
            <ChevronLeft className="size-8" />
          </Button>

          <div className="flex flex-col flex-center p-8 max-w-full max-h-full mx-8">
            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="max-w-full max-h-[50vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="text-xl font-semibold">{currentProduct.name}</h3>
              <p className="text-sm text-gray-300 mt-1">SKU: {currentProduct.sku}</p>
              <p className="text-xs text-gray-400 mt-2">
                {currentIndex + 1} of {products.length}
                {hasMorePages ? '+' : ''}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20 disabled:opacity-30"
            onClick={handleNext}
            disabled={!canGoNext}>
            <ChevronRight className="size-8" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
