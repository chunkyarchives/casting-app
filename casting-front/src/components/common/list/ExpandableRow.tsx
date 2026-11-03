import type { ReactNode } from 'react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

type ToggleProps = {
  expanded: boolean
  label: string
  onToggle: () => void
}

export function ExpandToggle({ expanded, label, onToggle }: ToggleProps) {
  return (
    <Button variant="ghost" size="icon-sm" aria-expanded={expanded} aria-label={label} onClick={onToggle}>
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        strokeWidth={2}
        className={cn('transition-transform duration-200', expanded && 'rotate-180')}
      />
    </Button>
  )
}

type PanelProps = {
  columnCount: number
  open: boolean
  children: ReactNode
}

export function ExpandedPanel({ columnCount, open, children }: PanelProps) {
  return (
    <TableRow className="border-0 hover:bg-transparent">
      <TableCell colSpan={columnCount} className="p-0 whitespace-normal">
        <Collapsible open={open}>
          <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
            {children}
          </CollapsibleContent>
        </Collapsible>
      </TableCell>
    </TableRow>
  )
}