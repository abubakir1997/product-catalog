import { DeleteProductDialog } from '@/components/delete-product-dialog'
import { EditProductDialog } from '@/components/edit-product-dialog'
import { LoadingButton } from '@/components/loading-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { type ProductData } from '@/store/catalog'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, Edit, Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'

function ProductActions({ product }: { product: ProductData }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div className="flex items-center gap-2">
      {product.loading ? (
        <LoadingButton variant="ghost" loading />
      ) : (
        <>
          {' '}
          <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)} className="h-8 w-8 p-0">
            <Edit className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive">
            <Trash2 className="size-4" />
          </Button>
          <EditProductDialog product={product} open={editOpen} onOpenChange={setEditOpen} />
          <DeleteProductDialog product={product} open={deleteOpen} onOpenChange={setDeleteOpen} />
        </>
      )}
    </div>
  )
}

export const CatalogColumns = (onImageClick?: (index: number) => void): ColumnDef<ProductData, ProductData>[] => [
  {
    size: 15,
    maxSize: 15,
    minSize: 15,
    id: 'select',
    enableColumnFilter: false,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <div className="flex-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex-center">
        {row.original.loading ? (
          <Loader2 className="animate-spin text-gray-500" />
        ) : (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        )}
      </div>
    ),
  },
  {
    size: 30,
    maxSize: 30,
    minSize: 30,
    id: 'image',
    enableColumnFilter: false,
    header() {
      return <div className="text-center">Image</div>
    },
    cell(props) {
      return (
        <Avatar
          className="rounded-lg m-auto border-2 cursor-pointer shadow-gray-500 hover:shadow-lg transition-shadow"
          onClick={() => onImageClick?.(props.row.index)}>
          <AvatarImage src={props.row.original.image} />
          <AvatarFallback>{props.row.original.sku.substring(0, 2)}</AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    size: 100,
    accessorKey: 'sku',
    enableHiding: false,
    header: ({ column }) => {
      const sortDirection = column.getIsSorted()

      return (
        <Button className="rounded-none" variant="ghost" onClick={() => column.toggleSorting(sortDirection === 'asc')}>
          SKU
          {sortDirection === 'asc' ? (
            <ArrowUp className="ml-2 size-4" />
          ) : sortDirection === 'desc' ? (
            <ArrowDown className="ml-2 size-4" />
          ) : undefined}
        </Button>
      )
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted()

      return (
        <Button className="rounded-none" variant="ghost" onClick={() => column.toggleSorting(sortDirection === 'asc')}>
          Name
          {sortDirection === 'asc' ? (
            <ArrowUp className="ml-2 size-4" />
          ) : sortDirection === 'desc' ? (
            <ArrowDown className="ml-2 size-4" />
          ) : undefined}
        </Button>
      )
    },
  },
  {
    id: 'brand',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted()

      return (
        <Button className="rounded-none" variant="ghost" onClick={() => column.toggleSorting(sortDirection === 'asc')}>
          Brand
          {sortDirection === 'asc' ? (
            <ArrowUp className="ml-2 size-4" />
          ) : sortDirection === 'desc' ? (
            <ArrowDown className="ml-2 size-4" />
          ) : undefined}
        </Button>
      )
    },
    cell(props) {
      return props.row.original.brand ? (
        <span>{props.row.original.brand}</span>
      ) : (
        <span className="text-gray-500">(no brand)</span>
      )
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted()

      return (
        <Button className="rounded-none" variant="ghost" onClick={() => column.toggleSorting(sortDirection === 'asc')}>
          Description
          {sortDirection === 'asc' ? (
            <ArrowUp className="ml-2 size-4" />
          ) : sortDirection === 'desc' ? (
            <ArrowDown className="ml-2 size-4" />
          ) : undefined}
        </Button>
      )
    },
  },
  {
    id: 'category',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted()

      return (
        <Button className="rounded-none" variant="ghost" onClick={() => column.toggleSorting(sortDirection === 'asc')}>
          Category
          {sortDirection === 'asc' ? (
            <ArrowUp className="ml-2 size-4" />
          ) : sortDirection === 'desc' ? (
            <ArrowDown className="ml-2 size-4" />
          ) : undefined}
        </Button>
      )
    },
    cell(props) {
      return <span className="capitalize">{props.row.original.category}</span>
    },
  },
  {
    id: 'actions',
    size: 50,
    maxSize: 50,
    minSize: 50,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => <ProductActions product={row.original} />,
  },
]
