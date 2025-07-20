import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/Product'

interface ProductCardProps {
  product: Product
  className?: string
  compact?: boolean
  onImageClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  onClick?: (event: React.MouseEvent<HTMLDivElement>, product: Product) => void
}

export function ProductCard({ product, className, onImageClick, onClick, compact = false }: ProductCardProps) {
  const handleAvatarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onImageClick) {
      event.preventDefault()
      event.stopPropagation()
      onImageClick(event)
    }
  }

  return (
    <Card
      onClick={(event) => onClick?.(event, product)}
      className={cn(
        'group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10',
        'bg-white dark:bg-gray-900',
        'border border-gray-300 dark:border-gray-700 shadow-md hover:shadow-lg',
        onClick && 'cursor-pointer',
        compact && 'pt-3 pb-1',
        className
      )}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className={cn('relative', compact && 'px-4')}>
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar
              onClick={handleAvatarClick}
              className={cn(
                'rounded-xl border-2 border-white dark:border-gray-800 shadow-lg ring-2 ring-gray-100 dark:ring-gray-800 transition-all duration-300',
                'group-hover:ring-blue-200 dark:group-hover:ring-blue-800 group-hover:shadow-blue-500/20',
                onImageClick && 'cursor-pointer',
                compact ? 'size-12' : 'size-16'
              )}>
              <AvatarImage src={product.image} alt={product.name} className="object-cover" />
              <AvatarFallback
                className={cn(
                  'rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold',
                  compact ? 'text-xs' : 'text-sm'
                )}>
                {product.sku.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Glowing dot indicator */}
            <div className="absolute -top-1 -right-1 size-3 bg-green-500 rounded-full shadow-lg ring-2 ring-white dark:ring-gray-900" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <h3
              className={cn(
                'font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent truncate',
                compact ? 'text-sm' : 'text-base'
              )}>
              {product.name}
            </h3>

            <div
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
                compact ? 'text-xs' : 'text-sm'
              )}>
              <div className="size-1.5 bg-blue-500 rounded-full" />
              <span className="font-mono text-gray-600 dark:text-gray-400">{product.sku}</span>
            </div>

            {product.brand && (
              <div
                className={cn(
                  'inline-flex ml-1 items-center gap-1 text-gray-600 dark:text-gray-400',
                  compact ? 'text-xs' : 'text-sm'
                )}>
                <span className="text-gray-400">by</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">{product.brand}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {!compact && (
        <CardContent className="relative space-y-3">
          {product.category && (
            <Badge
              variant="secondary"
              className="capitalize bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
              {product.category}
            </Badge>
          )}

          {product.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </CardContent>
      )}

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Card>
  )
}
