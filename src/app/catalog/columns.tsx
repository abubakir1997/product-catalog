import { DeleteProductDialog } from '@/components/delete-product-dialog'
import { EditProductDialog } from '@/components/edit-product-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { ProductData } from '@/store/catalog'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

function ProductActions({ product }: { product: ProductData }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)} className="h-8 w-8 p-0">
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setDeleteOpen(true)}
        className="h-8 w-8 p-0 text-destructive hover:text-destructive">
        <Trash2 className="h-4 w-4" />
      </Button>
      <EditProductDialog product={product} open={editOpen} onOpenChange={setEditOpen} />
      <DeleteProductDialog product={product} open={deleteOpen} onOpenChange={setDeleteOpen} />
    </div>
  )
}

export const CatalogColumns: ColumnDef<ProductData, ProductData>[] = [
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
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
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
        <Avatar className="rounded-lg m-auto">
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
      return (
        <Button
          className="rounded-none"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          SKU
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          className="rounded-none"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: 'brand',
    header: ({ column }) => {
      return (
        <Button
          className="rounded-none"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Brand
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
      return (
        <Button
          className="rounded-none"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: 'category',
    header: ({ column }) => {
      return (
        <Button
          className="rounded-none"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
