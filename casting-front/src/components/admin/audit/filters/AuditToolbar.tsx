import { Cancel01Icon, UnavailableIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { FilterMenu } from '@/components/common/list/FilterMenu'
import { SearchField } from '@/components/common/list/SearchField'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/format'
import { actionGroups } from '../audit-actions'
import { hasAuditFilters, type AuditFilters } from './audit-filters'

type Props = {
  filters: AuditFilters
  targetLabel?: string
  clearedAt: string | null
  onChange: (changes: Partial<Omit<AuditFilters, 'page'>>, options?: { replace?: boolean }) => void
  onClearFilters: () => void
  onClearLog: () => void
  onRestoreLog: () => void
}

export function AuditToolbar({
  filters,
  targetLabel,
  clearedAt,
  onChange,
  onClearFilters,
  onClearLog,
  onRestoreLog,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchField
        value={filters.search}
        onChange={(search) => onChange({ search }, { replace: true })}
        placeholder="Search by admin, target or reason"
        label="Search audit logs"
        className="mx-0 max-w-80"
      />
      <FilterMenu
        label="Actions"
        groups={actionGroups}
        checked={filters.actions}
        onCheckedChange={(actions) => onChange({ actions })}
      />

      {filters.target && (
        <RemovableChip label="Target" value={targetLabel ?? filters.target.slice(0, 8)} onRemove={() => onChange({ target: '' })} />
      )}
      {clearedAt && <RemovableChip label="After" value={formatDateTime(clearedAt)} onRemove={onRestoreLog} />}

      <Button variant="ghost" disabled={!hasAuditFilters(filters)} onClick={onClearFilters}>
        Clear filters
      </Button>
      <Button variant="outline" className="ml-auto" onClick={onClearLog}>
        <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} data-icon="inline-start" />
        Clear log
      </Button>
    </div>
  )
}

type ChipProps = {
  label: string
  value: string
  onRemove: () => void
}

function RemovableChip({ label, value, onRemove }: ChipProps) {
  return (
    <Button variant="secondary" className="max-w-72" aria-label={`Remove ${label.toLowerCase()} ${value}`} onClick={onRemove}>
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate">{value}</span>
      <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} data-icon="inline-end" />
    </Button>
  )
}