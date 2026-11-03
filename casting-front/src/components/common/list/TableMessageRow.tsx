import type { ReactNode } from 'react'
import { TableCell, TableRow } from '@/components/ui/table'

type Props = {
  columnCount: number
  children: ReactNode
}

export function TableMessageRow({ columnCount, children }: Props) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={columnCount} className="p-0 whitespace-normal">
        {children}
      </TableCell>
    </TableRow>
  )
}