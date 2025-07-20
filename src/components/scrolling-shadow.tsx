import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

interface ScrollingShadowProps {
  children: React.ReactNode
  className?: string
  shadowSize?: number
}

export function ScrollingShadow({ children, className, shadowSize = 20 }: ScrollingShadowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showTopShadow, setShowTopShadow] = useState(false)
  const [showBottomShadow, setShowBottomShadow] = useState(false)

  const updateShadows = () => {
    const element = scrollRef.current
    if (!element) return

    const { scrollTop, scrollHeight, clientHeight } = element

    // Show top shadow if scrolled down
    setShowTopShadow(scrollTop > 0)

    // Show bottom shadow if there's more content below
    setShowBottomShadow(scrollTop + clientHeight < scrollHeight - 1)
  }

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    // Initial check
    updateShadows()

    // Add scroll listener
    element.addEventListener('scroll', updateShadows, { passive: true })

    // Add resize observer to handle content changes
    const resizeObserver = new ResizeObserver(updateShadows)
    resizeObserver.observe(element)

    return () => {
      element.removeEventListener('scroll', updateShadows)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className={cn('relative', className)}>
      {/* Top shadow */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 z-10 pointer-events-none transition-opacity duration-300',
          'bg-gradient-to-b from-white via-white/80 to-transparent dark:from-gray-950 dark:via-gray-950/80',
          showTopShadow ? 'opacity-100' : 'opacity-0'
        )}
        style={{ height: `${shadowSize}px` }}
      />

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="overflow-y-auto"
        style={{
          height: '100%',
          paddingTop: showTopShadow ? `${shadowSize / 2}px` : '0',
          paddingBottom: showBottomShadow ? `${shadowSize / 2}px` : '0',
        }}>
        {children}
      </div>

      {/* Bottom shadow */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 z-10 pointer-events-none transition-opacity duration-300',
          'bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-950 dark:via-gray-950/80',
          showBottomShadow ? 'opacity-100' : 'opacity-0'
        )}
        style={{ height: `${shadowSize}px` }}
      />
    </div>
  )
}
