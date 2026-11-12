import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { cardStripClass } from './card-styles'

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton className={cn('flex flex-col rounded-2xl', className)}>
      <div className="aspect-square" />
      <div className={cardStripClass} />
    </Skeleton>
  )
}