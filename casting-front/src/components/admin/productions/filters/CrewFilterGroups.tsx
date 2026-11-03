import { useId } from 'react'
import { CheckboxGroup, type Option } from '@/components/common/list/CheckboxGroup'
import { FilterBar, FilterSeparator } from '@/components/common/list/FilterBar'
import { Field, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
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
  onChange: (changes: Partial<Pick<CrewFilters, 'films' | 'members' | 'nonProd'>>) => void
  onClear: () => void
}

export function CrewFilterGroups({ filters, onChange, onClear }: Props) {
  const switchId = useId()

  return (
    <FilterBar onClear={onClear}>
      <CheckboxGroup
        legend="Films"
        options={filmOptions}
        checked={filters.films}
        onCheckedChange={(films) => onChange({ films })}
      />
      <FilterSeparator />
      <CheckboxGroup
        legend="Member count"
        options={memberOptions}
        checked={filters.members}
        onCheckedChange={(members) => onChange({ members })}
        disabled={filters.nonProd}
      />
      <FilterSeparator />
      <FieldSet className="w-auto gap-2">
        <FieldLegend variant="label">Miscellaneous</FieldLegend>
        <Field orientation="horizontal" className="w-auto gap-2">
          <Switch
            id={switchId}
            checked={filters.nonProd}
            onCheckedChange={(nonProd) => onChange({ nonProd, members: [] })}
          />
          <FieldLabel htmlFor={switchId} className="font-normal">
            Non-prod filmmakers
          </FieldLabel>
        </Field>
      </FieldSet>
    </FilterBar>
  )
}