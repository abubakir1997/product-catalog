'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { change } from '@/lib/change'
import { PAGINATION_LIMIT } from '@/lib/constants'
import { getSetStateActionValue } from '@/lib/getSetStateActionValue'
import { cn } from '@/lib/utils'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortDirection,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { LoaderCircle, RefreshCcwIcon } from 'lucide-react'
import { useState } from 'react'

const DATA_TABLE_ROW_HEIGHT = 49

const DATA_TABLE_HEADER_ROW_HEIGHT = 40

interface DataTableProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]

  loading?: boolean
  defaultSearchColumnId?: string

  query?: string
  onQueryChange?: (query: string) => void

  page?: number
  onPageChange?: (page: number) => void

  sortBy?: string
  sortByDirection?: SortDirection
  onSortChange?: (sortBy: string, direction: SortDirection) => void

  className?: string
  onRefresh?: () => void
}

export function DataTable<TData, TValue>({
  data,
  columns,

  loading,
  defaultSearchColumnId,

  query = '',
  onQueryChange,
  page = 0,
  onPageChange,
  sortBy,
  sortByDirection,
  onSortChange,

  className,
  onRefresh,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const pagination: PaginationState = {
    pageIndex: page,
    pageSize: PAGINATION_LIMIT,
  }

  const sorting: SortingState = sortBy ? [{ id: sortBy, desc: sortByDirection === 'desc' }] : []

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (setStateAction) => {
      const nextPagination = getSetStateActionValue(setStateAction, pagination)
      onPageChange?.(nextPagination.pageIndex)
    },
    onSortingChange: (setStateAction) => {
      const nextSorting = getSetStateActionValue(setStateAction, sorting)
      const nextSortBy = nextSorting[0]

      if (nextSortBy) {
        onSortChange?.(nextSortBy.id, nextSortBy.desc ? 'desc' : 'asc')
      }
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  })

  const tableColumns = table.getAllColumns()
  const canFilterColumns = tableColumns.filter((col) => col.getCanFilter())
  const canHideColumns = tableColumns.filter((column) => column.getCanHide())
  const [searchColumn, setSearchColumn] = useState<string | undefined>(defaultSearchColumnId ?? canFilterColumns[0]?.id)

  return (
    <div>
      <div className="flex y-center py-4 space-x-2">
        {onQueryChange ? (
          <Input
            className="max-w-sm"
            placeholder="Search items"
            value={query}
            onChange={change((value) => {
              table.resetPageIndex()
              onQueryChange?.(value)
            })}
          />
        ) : (
          searchColumn !== undefined && (
            <>
              {canFilterColumns.length > 1 && (
                <Select
                  value={searchColumn}
                  onValueChange={(nextSearchColumn) => {
                    const tableSearchColumn = table.getColumn(searchColumn)
                    const nextTableSearchColumn = table.getColumn(nextSearchColumn)

                    tableSearchColumn?.setFilterValue('')
                    nextTableSearchColumn?.setFilterValue((tableSearchColumn?.getFilterValue() as string) ?? '')

                    setSearchColumn(nextSearchColumn)
                  }}>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select Column" />
                  </SelectTrigger>
                  <SelectContent>
                    {canFilterColumns.map((column) => (
                      <SelectItem key={column.id} value={column.id} className="capitalize">
                        {column.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Input
                placeholder={`Filter ${searchColumn}...`}
                value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
                onChange={change(table.getColumn(searchColumn)?.setFilterValue)}
                className="max-w-sm"
              />
            </>
          )
        )}
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            <RefreshCcwIcon className={cn({ 'animate-spin': loading })} />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {canHideColumns.map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onClick={(event) => {
                    event.preventDefault()
                    column.toggleVisibility()
                  }}>
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div
        className={`rounded-md border relative min-h-[${DATA_TABLE_ROW_HEIGHT * 10 + DATA_TABLE_HEADER_ROW_HEIGHT}px]`}>
        {loading && (
          <div className="absolute flex xy-center top-0 left-0 size-full z-10 bg-gray-100/50 dark:bg-gray-100/5">
            <LoaderCircle className="animate-spin size-24" />
          </div>
        )}
        <Table className={className}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.getSize() }}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className={`h-[${DATA_TABLE_ROW_HEIGHT * 10}px] text-center`}>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between space-x-2 py-4">
        <div className="text-gray-500">
          Items {page * PAGINATION_LIMIT + 1} - {page * PAGINATION_LIMIT + data.length}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)} disabled={page === 0}>
            {'<<'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex((pageIndex) => Math.max(pageIndex - 1, 0))}
            disabled={page === 0}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex((pageIndex) => pageIndex + 1)}
            disabled={data.length % PAGINATION_LIMIT !== 0}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
