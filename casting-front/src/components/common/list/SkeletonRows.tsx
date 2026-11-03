import { Skeleton } from '@/components/ui/skeleton'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useDelay } from '@/hooks/useDelay'

const defaultRowCount = 5

const placeholderDelayMs = 300

type Props = {
  columnCount: number
  rowCount?: number
}

export function SkeletonRows({ columnCount, rowCount = defaultRowCount }: Props) {
  const slow = useDelay(placeholderDelayMs)

  return (
    <TableBody aria-busy>
      {slow &&
        Array.from({ length: rowCount }, (_, row) => (
          <TableRow key={row} className="hover:bg-transparent">
            {Array.from({ length: columnCount }, (_, column) => (
              <TableCell key={column}>
                <div className="flex h-8 items-center">
                  <Skeleton className="h-4 w-full max-w-24" />
                </div>
              </TableCell>
            ))}
          </TableRow>
        ))}
    </TableBody>
  )
}