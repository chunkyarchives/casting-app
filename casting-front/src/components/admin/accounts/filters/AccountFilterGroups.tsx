import { useId } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import type { SignUpRole } from '@/types/participant'
import type { AccountFilters, AccountStatus, ProfileState } from './account-filters'

type Option<T extends string> = { value: T; label: string }

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
    <div className="@container">
      <div className="flex flex-col items-start gap-4 @4xl:flex-row @4xl:flex-wrap @4xl:items-end @4xl:gap-x-8">
        <CheckboxGroup
          legend="Role"
          options={roleOptions}
          checked={filters.roles}
          onCheckedChange={(roles) => onChange({ roles })}
        />
        <GroupSeparator />
        <CheckboxGroup
          legend="Status"
          options={statusOptions}
          checked={filters.statuses}
          onCheckedChange={(statuses) => onChange({ statuses })}
        />
        <GroupSeparator />
        <CheckboxGroup
          legend="Profile"
          options={profileOptions}
          checked={filters.profiles}
          onCheckedChange={(profiles) => onChange({ profiles })}
        />
        <Button variant="ghost" size="sm" className="@4xl:ml-auto" onClick={onClear}>
          Clear filters
        </Button>
      </div>
    </div>
  )
}

function GroupSeparator() {
  return <Separator orientation="vertical" className="hidden @4xl:block" />
}

type CheckboxGroupProps<T extends string> = {
  legend: string
  options: Option<T>[]
  checked: T[]
  onCheckedChange: (checked: T[]) => void
}

function CheckboxGroup<T extends string>({ legend, options, checked, onCheckedChange }: CheckboxGroupProps<T>) {
  const id = useId()

  const toggle = (value: T, on: boolean) =>
    onCheckedChange(
      options.map((option) => option.value).filter((v) => (v === value ? on : checked.includes(v))),
    )

  return (
    <FieldSet className="w-auto gap-2">
      <FieldLegend variant="label">{legend}</FieldLegend>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {options.map(({ value, label }) => (
          <Field key={value} orientation="horizontal" className="w-auto gap-2">
            <Checkbox
              id={`${id}-${value}`}
              checked={checked.includes(value)}
              onCheckedChange={(on) => toggle(value, on)}
            />
            <FieldLabel htmlFor={`${id}-${value}`} className="font-normal">
              {label}
            </FieldLabel>
          </Field>
        ))}
      </div>
    </FieldSet>
  )
}