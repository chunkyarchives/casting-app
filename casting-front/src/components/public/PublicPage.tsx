import type { ReactNode } from 'react'
import { formatCount } from '@/lib/format'

type Props = {
  title: string
  description: string
  count?: number
  toolbar?: ReactNode
  children: ReactNode
}

export function PublicPage({ title, description, count, toolbar, children }: Props) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 pt-12 pb-16">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-8 w-1.5 shrink-0 -skew-x-12 bg-primary" />
          <h1 className="text-4xl font-bold">{title}</h1>
          {count !== undefined && <span className="text-2xl text-muted-foreground tabular-nums">{formatCount(count)}</span>}
        </div>
        <p className="max-w-prose text-muted-foreground">{description}</p>
      </header>

      {toolbar}
      {children}
    </section>
  )
}