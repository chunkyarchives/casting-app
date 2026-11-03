import { Fragment, useState, type ReactNode } from 'react'
import { ExpandToggle, ExpandedPanel } from '@/components/common/list/ExpandableRow'
import { SkeletonRows } from '@/components/common/list/SkeletonRows'
import { TableMessageRow } from '@/components/common/list/TableMessageRow'
import { LoadError } from '@/components/common/states/LoadError'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatLogTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { AuditEntry } from '@/types/admin'
import { auditActions, targetTypeLabel, toneColors } from '../audit-actions'
import { AuditEntryDetails } from './AuditEntryDetails'

type Props = {
  entries: AuditEntry[]
  stale: boolean
  empty: ReactNode
  onTargetSelect: (targetId: string) => void
}

const columnCount = 6

const tableLayout = 'min-w-4xl table-fixed'

export function AuditTable({ entries, stale, empty, onTargetSelect }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <Table className={cn(tableLayout, 'transition-opacity', stale && 'opacity-60')} aria-busy={stale}>
      <AuditHeader />

      <TableBody>
        {entries.length === 0 ? (
          <TableMessageRow columnCount={columnCount}>{empty}</TableMessageRow>
        ) : (
          entries.map((entry) => {
            const expanded = entry.id === expandedId
            const action = auditActions[entry.action]
            const toggle = () => setExpandedId(expanded ? null : entry.id)

            return (
              <Fragment key={entry.id}>
                <TableRow className="cursor-pointer" onClick={toggle}>
                  <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">
                    {formatLogTime(entry.createdAt)}
                  </TableCell>
                  <TableCell className={cn('truncate font-mono text-xs', toneColors[action.tone])}>{action.code}</TableCell>
                  <TableCell className="truncate">{entry.adminEmail}</TableCell>
                  <TableCell onClick={(event) => event.stopPropagation()}>
                    <Button
                      variant="link"
                      className="h-auto max-w-full flex-col items-start gap-0 px-0 font-normal text-foreground"
                      title="Show only this target"
                      onClick={() => onTargetSelect(entry.targetId)}
                    >
                      <span className="max-w-full truncate">{entry.targetLabel}</span>
                      <span className="text-xs text-muted-foreground">{targetTypeLabel(entry.targetType)}</span>
                    </Button>
                  </TableCell>
                  <TableCell className="truncate text-muted-foreground" title={entry.reason ?? undefined}>
                    {entry.reason ?? '—'}
                  </TableCell>
                  <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                    <ExpandToggle
                      expanded={expanded}
                      label={`${expanded ? 'Hide' : 'Show'} the full entry`}
                      onToggle={toggle}
                    />
                  </TableCell>
                </TableRow>

                <ExpandedPanel columnCount={columnCount} open={expanded}>
                  <AuditEntryDetails entry={entry} />
                </ExpandedPanel>
              </Fragment>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}

export function AuditTableSkeleton() {
  return (
    <Table className={tableLayout}>
      <AuditHeader />
      <SkeletonRows columnCount={columnCount} />
    </Table>
  )
}

export function AuditTableError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <Table className={tableLayout}>
      <AuditHeader />
      <TableBody>
        <TableMessageRow columnCount={columnCount}>
          <LoadError title="Audit logs could not be loaded" error={error} onRetry={onRetry} />
        </TableMessageRow>
      </TableBody>
    </Table>
  )
}

function AuditHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-44">Time</TableHead>
        <TableHead className="w-52">Action</TableHead>
        <TableHead className="w-48">Admin</TableHead>
        <TableHead>Target</TableHead>
        <TableHead>Reason</TableHead>
        <TableHead className="w-14">
          <span className="sr-only">Full entry</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  )
}