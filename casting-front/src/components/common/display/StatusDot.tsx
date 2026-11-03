import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const toneColors = {
  positive: 'bg-emerald-500',
  neutral: 'bg-muted-foreground/50',
} as const

type Props = {
  tone: keyof typeof toneColors
  children: ReactNode
}

export function StatusDot({ tone, children }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap">
      <span aria-hidden className={cn('size-2 shrink-0 rounded-full', toneColors[tone])} />
      {children}
    </span>
  )
}