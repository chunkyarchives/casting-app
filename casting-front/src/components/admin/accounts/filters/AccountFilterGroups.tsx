import { CheckboxGroup, type Option } from '@/components/common/list/CheckboxGroup'
import { FilterBar, FilterSeparator } from '@/components/common/list/FilterBar'
import type { SignUpRole } from '@/types/participant'
import type { AccountFilters, AccountStatus, ProfileState } from './account-filters'

const roleOptions: Option<SignUpRole>[] = [
  { value: 'Actor', label: 'Actors' },
  { value: 'Director', label: 'Directors' },
  { value: 'CastingDirector', label: 'Casting directors' },
]

const statusOptions: Option<AccountStatus>[] = [
  { value: 'active', label: 'Active' },
  { value: 'locked', label: 'Locked' },
]

const profileOptions: Option<ProfileState>[] = [
  { value: 'complete', label: 'Complete' },
  { value: 'incomplete', label: 'Incomplete' },
]

type Props = {
  filters: AccountFilters
  onChange: (changes: Partial<Pick<AccountFilters, 'roles' | 'statuses' | 'profiles'>>) => void
  onClear: () => void
}

export function AccountFilterGroups({ filters, onChange, onClear }: Props) {
  return (
    <FilterBar onClear={onClear}>
      <CheckboxGroup
        legend="Role"
        options={roleOptions}
        checked={filters.roles}
        onCheckedChange={(roles) => onChange({ roles })}
      />
      <FilterSeparator />
      <CheckboxGroup
        legend="Status"
        options={statusOptions}
        checked={filters.statuses}
        onCheckedChange={(statuses) => onChange({ statuses })}
      />
      <FilterSeparator />
      <CheckboxGroup
        legend="Profile"
        options={profileOptions}
        checked={filters.profiles}
        onCheckedChange={(profiles) => onChange({ profiles })}
      />
    </FilterBar>
  )
}