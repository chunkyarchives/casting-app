import { subYears } from 'date-fns'
import { useController } from 'react-hook-form'
import { DatePicker } from '@/components/common/form/DatePicker'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { earliestBirthDate, todayIso, type PersonValues } from '@/lib/validation/profile'

const typicalBirthMonth = subYears(new Date(), 25)

export function DateOfBirthRow() {
  const { field, fieldState } = useController<PersonValues, 'dateOfBirth'>({ name: 'dateOfBirth' })

  return (
    <SettingsRow
      label="Date of birth"
      hint="Only you and the admins see the date. Everyone else sees your age."
      missing={!field.value}
      error={fieldState.error?.message}
    >
      <DatePicker
        label="Date of birth"
        align="center"
        value={field.value}
        onChange={field.onChange}
        min={earliestBirthDate}
        max={todayIso()}
        defaultMonth={typicalBirthMonth}
        invalid={fieldState.invalid}
      />
    </SettingsRow>
  )
}