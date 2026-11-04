import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  children: ReactNode
  canClear: boolean
  onClear: () => void
  end?: ReactNode
}

export function FilterBar({ children, canClear, onClear, end }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {children}
      <Button variant="ghost" disabled={!canClear} onClick={onClear}>
        Clear filters
      </Button>
      {end && <div className="ml-auto flex items-center gap-2">{end}</div>}
    </div>
  )
}