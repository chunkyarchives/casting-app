import { useController } from 'react-hook-form'
import { CountryCombobox } from '@/components/common/form/CountryCombobox'
import { SettingsRow } from '@/components/settings/SettingsRow'
import type { PersonValues } from '@/lib/validation/profile'

export function OriginRow() {
  const { field, fieldState } = useController<PersonValues, 'origin'>({ name: 'origin' })

  return (
    <SettingsRow
      label="Origin"
      hint="Your country of origin. Its flag is shown on your profile."
      missing={!field.value}
      error={fieldState.error?.message}
    >
      <CountryCombobox
        label="Origin"
        align="center"
        value={field.value}
        onChange={field.onChange}
        invalid={fieldState.invalid}
      />
    </SettingsRow>
  )
}