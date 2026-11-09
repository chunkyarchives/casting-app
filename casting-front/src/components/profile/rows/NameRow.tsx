import { useController } from 'react-hook-form'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { Input } from '@/components/ui/input'
import type { PersonValues } from '@/lib/validation/profile'

export function NameRow() {
  const firstName = useController<PersonValues, 'firstName'>({ name: 'firstName' })
  const lastName = useController<PersonValues, 'lastName'>({ name: 'lastName' })

  return (
    <SettingsRow
      label="Name"
      hint="Your first and last name, as everyone on the platform sees them."
      error={firstName.fieldState.error?.message ?? lastName.fieldState.error?.message}
    >
      <div className="grid grid-cols-2 gap-2">
        <Input
          {...firstName.field}
          aria-label="First name"
          aria-invalid={firstName.fieldState.invalid}
          autoComplete="given-name"
          maxLength={100}
          className="text-center"
        />
        <Input
          {...lastName.field}
          aria-label="Last name"
          aria-invalid={lastName.fieldState.invalid}
          autoComplete="family-name"
          maxLength={100}
          className="text-center"
        />
      </div>
    </SettingsRow>
  )
}