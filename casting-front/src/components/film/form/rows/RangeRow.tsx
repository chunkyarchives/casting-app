import { NumberStepper } from '@/components/settings/NumberStepper'
import { SettingsRow } from '@/components/settings/SettingsRow'
import type { RowField } from './row-field'

type Props = {
  low: RowField<number | null>
  high: RowField<number | null>
  label: string
  hint: string
  range: { min: number; max: number }
  unit: string
  error?: string
}

export function RangeRow({ low, high, label, hint, range, unit, error }: Props) {
  return (
    <SettingsRow label={label} hint={hint} error={error}>
      <div className="grid gap-2 sm:grid-cols-2">
        <NumberStepper
          label={`Lowest ${label.toLowerCase()}`}
          value={low.value}
          onChange={low.onChange}
          min={range.min}
          max={range.max}
          unit={unit}
          placeholder="From"
          invalid={error !== undefined}
        />
        <NumberStepper
          label={`Highest ${label.toLowerCase()}`}
          value={high.value}
          onChange={high.onChange}
          min={range.min}
          max={range.max}
          unit={unit}
          placeholder="To"
          invalid={error !== undefined}
        />
      </div>
    </SettingsRow>
  )
}