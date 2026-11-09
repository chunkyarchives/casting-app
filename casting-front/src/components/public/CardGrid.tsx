import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useDelay } from '@/hooks/useDelay'
import { cn } from '@/lib/utils'

const placeholderDelayMs = 300
const placeholderCount = 8

type Props = {
  className?: string
  stale?: boolean
  children: ReactNode
}

export function CardGrid({ className, stale = false, children }: Props) {
  return (
    <ul aria-busy={stale || undefined} className={cn('grid gap-4 transition-opacity', stale && 'opacity-60', className)}>
      {children}
    </ul>
  )
}

export function CardGridSkeleton({ className, itemClassName }: { className?: string; itemClassName: string }) {
  const slow = useDelay(placeholderDelayMs)

  return (
    <CardGrid className={className}>
      {slow &&
        Array.from({ length: placeholderCount }, (_, index) => (
          <li key={index}>
            <Skeleton className={cn('rounded-xl', itemClassName)} />
          </li>
        ))}
    </CardGrid>
  )
}