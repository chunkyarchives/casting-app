import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  id?: string
  as?: 'h1' | 'h2' | 'h3'
  size?: 'section' | 'page'
  className?: string
  children: ReactNode
}

export function SectionTitle({ id, as: Heading = 'h2', size = 'section', className, children }: Props) {
  return (
    <div className={cn('border-b', className)}>
      <Heading
        id={id}
        className={cn(
          '-mb-px inline-block border-b-2 border-foreground pb-3',
          size === 'page' ? 'text-2xl font-bold' : 'font-semibold',
        )}
      >
        {children}
      </Heading>
    </div>
  )
}