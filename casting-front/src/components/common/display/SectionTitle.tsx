import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  id?: string
  as?: 'h1' | 'h2' | 'h3'
  size?: 'section' | 'page'
  aside?: ReactNode
  className?: string
  children: ReactNode
}

export function SectionTitle({ id, as: Heading = 'h2', size = 'section', aside, className, children }: Props) {
  return (
    <div className={cn('flex items-end gap-3 border-b', className)}>
      <Heading
        id={id}
        className={cn(
          '-mb-px inline-block shrink-0 border-b-2 border-foreground pb-3',
          size === 'page' ? 'text-2xl font-bold' : 'font-semibold',
        )}
      >
        {children}
      </Heading>
      {aside && <span className="min-w-0 truncate pb-3 text-sm text-muted-foreground">{aside}</span>}
    </div>
  )
}