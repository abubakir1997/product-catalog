import { Button, type ButtonProps } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
  onAsyncClick?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<any>
}

export function LoadingButton({ loading, children, disabled, onClick, onAsyncClick, ...props }: LoadingButtonProps) {
  const [isLoading, setLoading] = useState(false)

  const handleAsyncClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true)

    try {
      await onAsyncClick?.(event)
    } finally {
      setLoading(false)
      onClick?.(event)
    }
  }

  const finalLoading = loading || isLoading
  const finalDisabled = disabled || finalLoading

  return (
    <Button disabled={finalDisabled} {...props} onClick={onAsyncClick ? handleAsyncClick : onClick}>
      {finalLoading && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  )
}
