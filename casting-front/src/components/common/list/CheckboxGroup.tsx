import { useId } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { cn } from '@/lib/utils'

export type Option<T extends string> = { value: T; label: string }

type Props<T extends string> = {
  legend: string
  options: Option<T>[]
  checked: T[]
  onCheckedChange: (checked: T[]) => void
  disabled?: boolean
}

export function CheckboxGroup<T extends string>({
  legend,
  options,
  checked,
  onCheckedChange,
  disabled = false,
}: Props<T>) {
  const id = useId()

  const toggle = (value: T, on: boolean) =>
    onCheckedChange(
      options.map((option) => option.value).filter((v) => (v === value ? on : checked.includes(v))),
    )

  return (
    <FieldSet className="w-auto gap-2">
      <FieldLegend variant="label" className={cn(disabled && 'opacity-50')}>
        {legend}
      </FieldLegend>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {options.map(({ value, label }) => (
          <Field key={value} orientation="horizontal" data-disabled={disabled} className="w-auto gap-2">
            <Checkbox
              id={`${id}-${value}`}
              checked={checked.includes(value)}
              onCheckedChange={(on) => toggle(value, on)}
              disabled={disabled}
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