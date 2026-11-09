import { useController } from 'react-hook-form'
import { NumberStepper } from '@/components/settings/NumberStepper'
import { SettingsRow } from '@/components/settings/SettingsRow'
import type { ActorProfileValues } from '@/lib/validation/actor'

type Props = {
  name: 'height' | 'weight'
  label: string
  unit: string
  range: { min: number; max: number }
  placeholder: string
  hint: string
}

export function MeasurementRow({ name, label, unit, range, placeholder, hint }: Props) {
  const { field, fieldState } = useController<ActorProfileValues, Props['name']>({ name })

  return (
    <SettingsRow label={label} hint={hint} missing={!field.value} error={fieldState.error?.message}>
      <NumberStepper
        label={label}
        value={field.value}
        onChange={field.onChange}
        min={range.min}
        max={range.max}
        unit={unit}
        placeholder={placeholder}
        invalid={fieldState.invalid}
      />
    </SettingsRow>
  )
}