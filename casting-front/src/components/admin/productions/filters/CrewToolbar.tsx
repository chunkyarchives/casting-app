import { useId } from 'react'
import { FilterBar } from '@/components/common/list/FilterBar'
import { FilterMenu, FilterMenuGroup, type Option } from '@/components/common/list/FilterMenu'
import { SearchField } from '@/components/common/list/SearchField'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Field, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import type { CrewFilters, Presence } from './crew-filters'

const filmOptions: Option<Presence>[] = [
  { value: 'with', label: 'With films' },
  { value: 'without', label: 'No films' },
]

const memberOptions: Option<Presence>[] = [
  { value: 'with', label: 'With casting directors' },
  { value: 'without', label: 'Director only' },
]

type Props = {
  filters: CrewFilters
  canClear: boolean
  onChange: (changes: Partial<Omit<CrewFilters, 'page'>>, options?: { replace?: boolean }) => void
  onClear: () => void
}

export function CrewToolbar({ filters, canClear, onChange, onClear }: Props) {
  const switchId = useId()

  return (
    <FilterBar canClear={canClear} onClear={onClear}>
      <SearchField
        value={filters.search}
        onChange={(search) => onChange({ search }, { replace: true })}
        placeholder={filters.nonProd ? 'Search by director name or e-mail' : 'Search by name, code or director'}
        label="Search productions"
      />
      <FilterMenu label="Filters" activeCount={filters.films.length + filters.members.length}>
        <FilterMenuGroup
          label="Films"
          options={filmOptions}
          checked={filters.films}
          onCheckedChange={(films) => onChange({ films })}
        />
        <DropdownMenuSeparator />
        <FilterMenuGroup
          label="Member count"
          options={memberOptions}
          checked={filters.members}
          onCheckedChange={(members) => onChange({ members })}
          disabled={filters.nonProd}
        />
      </FilterMenu>
      <Field orientation="horizontal" className="w-auto gap-2 px-2">
        <Switch
          id={switchId}
          checked={filters.nonProd}
          onCheckedChange={(nonProd) => onChange({ nonProd, members: [] })}
        />
        <FieldLabel htmlFor={switchId} className="font-normal">
          Non-prod filmmakers
        </FieldLabel>
      </Field>
    </FilterBar>
  )
}