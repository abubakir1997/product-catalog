import { bulkDeleteProducts } from '@/api/bulkDeleteProducts'
import { LoadingButton } from '@/components/loading-button'
import { ProductCard } from '@/components/product-card'
import { ScrollingShadow } from '@/components/scrolling-shadow'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCatalogStore, type ProductData } from '@/store/catalog'
import { useState } from 'react'

interface BulkDeleteDialogProps {
  products: ProductData[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete?: () => void
}

export function BulkDeleteDialog({ products, open, onOpenChange, onComplete }: BulkDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const removeProduct = useCatalogStore((state) => state.removeProduct)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const productIds = products.map((product) => product._id)
      const deletedProducts = await bulkDeleteProducts(productIds)

      // Remove products from store
      deletedProducts.forEach((product) => removeProduct(product._id))

      onOpenChange(false)
      onComplete?.()
    } catch (error) {
      console.error('Failed to delete products:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Delete Products</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {products.length} product{products.length > 1 ? 's' : ''}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ScrollingShadow className="h-96" shadowSize={24}>
            <div className="space-y-3 px-1">
              {products.map((product) => (
                <ProductCard
                  compact
                  key={product._id}
                  product={product}
                  className="border-destructive/20 bg-destructive/5"
                />
              ))}
            </div>
          </ScrollingShadow>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <LoadingButton variant="destructive" loading={isDeleting} onClick={handleDelete}>
            Delete {products.length} Product{products.length > 1 ? 's' : ''}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
