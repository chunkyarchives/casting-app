import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

type Props = {
  children: ReactNode
  onClear: () => void
}

export function FilterBar({ children, onClear }: Props) {
  return (
    <div className="@container">
      <div className="flex flex-col items-start gap-4 @4xl:flex-row @4xl:flex-wrap @4xl:items-end @4xl:gap-x-8">
        {children}
        <Button variant="ghost" size="sm" className="@4xl:ml-auto" onClick={onClear}>
          Clear filters
        </Button>
      </div>
    </div>
  )
}

export function FilterSeparator() {
  return <Separator orientation="vertical" className="hidden @4xl:block" />
}