import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  expanded: boolean
  children: ReactNode
}

export function ExpandingPanel({ expanded, children }: Props) {
  return (
    <div
      className={cn(
        'absolute top-0 left-1/2 w-full -translate-x-1/2 overflow-hidden rounded-2xl border bg-card shadow-sm transition-[width,translate,box-shadow] duration-200 ease-out motion-reduce:transition-none',
        expanded && 'z-30 w-[calc(100%+1.875rem)] -translate-y-[0.9375rem] shadow-2xl ring-1 ring-primary/40',
      )}
    >
      {children}
    </div>
  )
}

export function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        'grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none',
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

export function ExpandingDetails({ expanded, children }: Props) {
  return (
    <Collapse open={expanded}>
      <div className="flex flex-col gap-3 p-4">{children}</div>
    </Collapse>
  )
}