import { Fragment, type ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function DetailList({ children }: { children: ReactNode }) {
  return <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2">{children}</dl>
}

export function DetailGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 text-sm">
      <h3 className="font-medium">{title}</h3>
      <DetailList>{children}</DetailList>
    </section>
  )
}

type DetailRowProps = {
  label: string
  stacked?: boolean
  children: ReactNode
}

export function DetailRow({ label, stacked = false, children }: DetailRowProps) {
  return (
    <>
      <dt className={cn('text-muted-foreground', stacked && 'col-span-2')}>{label}</dt>
      <dd className={cn(stacked ? 'col-span-2 -mt-1 whitespace-pre-line' : 'text-right')}>{children}</dd>
    </>
  )
}

export function DetailGroupsSkeleton({ rowCounts }: { rowCounts: number[] }) {
  return rowCounts.map((rowCount, group) => (
    <Fragment key={group}>
      {group > 0 && <Separator />}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-24" />
        <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2">
          {Array.from({ length: rowCount }, (_, row) => (
            <Fragment key={row}>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-28 justify-self-end" />
            </Fragment>
          ))}
        </div>
      </div>
    </Fragment>
  ))
}