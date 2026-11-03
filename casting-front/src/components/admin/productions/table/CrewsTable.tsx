import { Fragment, useState } from 'react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { siteMemberCount, type ProductionRow } from '@/components/admin/productions/production-rows'
import { LoadError } from '@/components/common/states/LoadError'
import { NoResults } from '@/components/common/states/NoResults'
import { SkeletonRows } from '@/components/common/list/SkeletonRows'
import { TableMessageRow } from '@/components/common/list/TableMessageRow'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCount } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AdminFilm } from '@/types/admin'
import { CrewFilmsPanel } from './CrewFilmsPanel'

type Props = {
  rows: ProductionRow[]
  stale: boolean
  revision: number
  onOpenRow: (row: ProductionRow) => void
  onOpenFilm: (film: AdminFilm) => void
}

const columnCount = 6

const tableLayout = 'min-w-3xl table-fixed'

export function CrewsTable({ rows, stale, revision, onOpenRow, onOpenFilm }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <Table className={cn(tableLayout, 'transition-opacity', stale && 'opacity-60')} aria-busy={stale}>
      <CrewsHeader />

      <TableBody>
        {rows.length === 0 ? (
          <TableMessageRow columnCount={columnCount}>
            <NoResults />
          </TableMessageRow>
        ) : (
          rows.map((row) => {
            const expanded = row.directorId === expandedId
            const name = row.crew?.productionName ?? `${row.directorName}'s films`

            return (
              <Fragment key={row.directorId}>
                <TableRow className="cursor-pointer" onClick={() => onOpenRow(row)}>
                  <TableCell className="truncate font-medium">
                    {row.crew ? row.crew.productionName : <NotAvailable>Unnamed production</NotAvailable>}
                  </TableCell>
                  <TableCell className="font-mono tracking-wider">
                    {row.crew ? row.crew.productionCode : <NotAvailable>N/A</NotAvailable>}
                  </TableCell>
                  <TableCell className="truncate text-muted-foreground">{row.directorName}</TableCell>
                  <TableCell className="text-center tabular-nums">{formatCount(siteMemberCount(row))}</TableCell>
                  <TableCell className="text-center tabular-nums">{formatCount(row.filmCount)}</TableCell>
                  <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-expanded={expanded}
                      aria-label={`${expanded ? 'Hide' : 'Show'} films of ${name}`}
                      onClick={() => setExpandedId(expanded ? null : row.directorId)}
                    >
                      <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        strokeWidth={2}
                        className={cn('transition-transform duration-200', expanded && 'rotate-180')}
                      />
                    </Button>
                  </TableCell>
                </TableRow>

                <TableRow className="border-0 hover:bg-transparent">
                  <TableCell colSpan={columnCount} className="p-0 whitespace-normal">
                    <Collapsible open={expanded}>
                      <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
                        <CrewFilmsPanel row={row} revision={revision} onOpenFilm={onOpenFilm} />
                      </CollapsibleContent>
                    </Collapsible>
                  </TableCell>
                </TableRow>
              </Fragment>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}

export function CrewsTableSkeleton() {
  return (
    <Table className={tableLayout}>
      <CrewsHeader />
      <SkeletonRows columnCount={columnCount} />
    </Table>
  )
}

export function CrewsTableError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <Table className={tableLayout}>
      <CrewsHeader />
      <TableBody>
        <TableMessageRow columnCount={columnCount}>
          <LoadError title="Productions could not be loaded" error={error} onRetry={onRetry} />
        </TableMessageRow>
      </TableBody>
    </Table>
  )
}

function CrewsHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead className="w-32">Code</TableHead>
        <TableHead className="w-56">Director</TableHead>
        <TableHead className="w-32 text-center">Site members</TableHead>
        <TableHead className="w-24 text-center">Films</TableHead>
        <TableHead className="w-14">
          <span className="sr-only">Show films</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  )
}

function NotAvailable({ children }: { children: string }) {
  return <span className="font-sans font-normal tracking-normal text-muted-foreground">{children}</span>
}