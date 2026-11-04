import { Fragment } from 'react'
import { Cancel01Icon, UnavailableIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { FilterBar } from '@/components/common/list/FilterBar'
import { FilterMenu, FilterMenuGroup } from '@/components/common/list/FilterMenu'
import { SearchField } from '@/components/common/list/SearchField'
import { Button } from '@/components/ui/button'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { formatDateTime } from '@/lib/format'
import { actionGroups } from '../audit-actions'
import type { AuditFilters } from './audit-filters'

type Props = {
  filters: AuditFilters
  canClear: boolean
  targetLabel?: string
  clearedAt: string | null
  onChange: (changes: Partial<Omit<AuditFilters, 'page'>>, options?: { replace?: boolean }) => void
  onClearFilters: () => void
  onClearLog: () => void
  onRestoreLog: () => void
}

export function AuditToolbar({
  filters,
  canClear,
  targetLabel,
  clearedAt,
  onChange,
  onClearFilters,
  onClearLog,
  onRestoreLog,
}: Props) {
  return (
    <FilterBar
      canClear={canClear}
      onClear={onClearFilters}
      end={
        <Button variant="outline" onClick={onClearLog}>
          <HugeiconsIcon icon={UnavailableIcon} strokeWidth={2} data-icon="inline-start" />
          Clear log
        </Button>
      }
    >
      <SearchField
        value={filters.search}
        onChange={(search) => onChange({ search }, { replace: true })}
        placeholder="Search by admin, target or reason"
        label="Search audit logs"
      />
      <FilterMenu label="Actions" activeCount={filters.actions.length}>
        {actionGroups.map((group, index) => (
          <Fragment key={group.label}>
            {index > 0 && <DropdownMenuSeparator />}
            <FilterMenuGroup
              label={group.label}
              options={group.options}
              checked={filters.actions}
              onCheckedChange={(actions) => onChange({ actions })}
            />
          </Fragment>
        ))}
      </FilterMenu>

      {filters.target && (
        <RemovableChip
          label="Target"
          value={targetLabel ?? filters.target.slice(0, 8)}
          onRemove={() => onChange({ target: '' })}
        />
      )}
      {clearedAt && <RemovableChip label="After" value={formatDateTime(clearedAt)} onRemove={onRestoreLog} />}
    </FilterBar>
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