import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { RowField } from './row-field'

export type Choice<TValue extends string> = {
  value: TValue
  label: string
  icon?: IconSvgElement
}

type Props<TValue extends string> = {
  field: RowField<TValue | null>
  label: string
  hint: string
  choices: Choice<TValue>[]
  emptyLabel?: string
  error?: string
}

const anyValue = 'any'

export function ChoiceRow<TValue extends string>({ field, label, hint, choices, emptyLabel, error }: Props<TValue>) {
  const selected = field.value ?? (emptyLabel ? anyValue : null)

  const choose = (next: string[]) => {
    const picked = next.at(-1)
    if (picked === undefined) return
    field.onChange(picked === anyValue ? null : (picked as TValue))
  }

  return (
    <SettingsRow label={label} hint={hint} error={error}>
      <ToggleGroup
        variant="outline"
        aria-label={label}
        className="w-full flex-wrap *:flex-1 *:aria-pressed:border-primary *:aria-pressed:text-foreground"
        value={selected ? [selected] : []}
        onValueChange={choose}
      >
        {emptyLabel && <ToggleGroupItem value={anyValue}>{emptyLabel}</ToggleGroupItem>}
        {choices.map((choice) => (
          <ToggleGroupItem key={choice.value} value={choice.value}>
            {choice.icon && <HugeiconsIcon icon={choice.icon} strokeWidth={2} />}
            {choice.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </SettingsRow>
  )
}