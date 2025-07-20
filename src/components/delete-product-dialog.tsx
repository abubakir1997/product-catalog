import { deleteProduct } from '@/api/deleteProduct'
import { LoadingButton } from '@/components/loading-button'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCatalogStore } from '@/store/catalog'
import type { Product } from '@/types/Product'
import { useState } from 'react'

interface DeleteProductDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteProductDialog({ product, open, onOpenChange }: DeleteProductDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const removeProduct = useCatalogStore((state) => state.removeProduct)
  const startProductLoading = useCatalogStore((state) => state.startProductLoading)
  const stopProductLoading = useCatalogStore((state) => state.stopProductLoading)

  const handleDelete = async () => {
    setIsDeleting(true)
    startProductLoading(product._id)

    try {
      await deleteProduct(product._id)
      removeProduct(product._id)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to delete product:', error)
      stopProductLoading(product._id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{product.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <LoadingButton variant="destructive" loading={isDeleting} onClick={handleDelete}>
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
