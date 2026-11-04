import { FilterBar } from '@/components/common/list/FilterBar'
import { FilterMenu, FilterMenuGroup, type Option } from '@/components/common/list/FilterMenu'
import { SearchField } from '@/components/common/list/SearchField'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
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
  canClear: boolean
  onChange: (changes: Partial<Omit<AccountFilters, 'page'>>, options?: { replace?: boolean }) => void
  onClear: () => void
}

export function AccountToolbar({ filters, canClear, onChange, onClear }: Props) {
  const activeCount = filters.roles.length + filters.statuses.length + filters.profiles.length

  return (
    <FilterBar canClear={canClear} onClear={onClear}>
      <SearchField
        value={filters.search}
        onChange={(search) => onChange({ search }, { replace: true })}
        placeholder="Search by name or e-mail"
        label="Search accounts"
      />
      <FilterMenu label="Filters" activeCount={activeCount}>
        <FilterMenuGroup
          label="Role"
          options={roleOptions}
          checked={filters.roles}
          onCheckedChange={(roles) => onChange({ roles })}
        />
        <DropdownMenuSeparator />
        <FilterMenuGroup
          label="Status"
          options={statusOptions}
          checked={filters.statuses}
          onCheckedChange={(statuses) => onChange({ statuses })}
        />
        <DropdownMenuSeparator />
        <FilterMenuGroup
          label="Profile"
          options={profileOptions}
          checked={filters.profiles}
          onCheckedChange={(profiles) => onChange({ profiles })}
        />
      </FilterMenu>
    </FilterBar>
  )
}