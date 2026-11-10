import { NumberStepper } from '@/components/settings/NumberStepper'
import { SettingsRow } from '@/components/settings/SettingsRow'
import type { RowField } from './row-field'

type Props = {
  field: RowField<number | null>
  label: string
  hint: string
  range: { min: number; max: number }
  placeholder?: string
  unit?: string
  error?: string
}

export function NumberRow({ field, label, hint, range, placeholder, unit, error }: Props) {
  return (
    <SettingsRow label={label} hint={hint} error={error}>
      <NumberStepper
        label={label}
        value={field.value}
        onChange={field.onChange}
        min={range.min}
        max={range.max}
        unit={unit}
        placeholder={placeholder}
        invalid={error !== undefined}
      />
    </SettingsRow>
  )
}