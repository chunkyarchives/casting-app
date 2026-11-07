import { NumberField } from '@base-ui/react/number-field'
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'

type Props = {
  label: string
  value: number | null
  onChange: (value: number | null) => void
  min: number
  max: number
  unit: string
  placeholder?: string
  invalid?: boolean
}

export function NumberStepper({ label, value, onChange, min, max, unit, placeholder, invalid = false }: Props) {
  return (
    <NumberField.Root
      value={value}
      onValueChange={(next) => onChange(next)}
      min={min}
      max={max}
      step={1}
      largeStep={10}
      format={{ maximumFractionDigits: 0 }}
    >
      <NumberField.Group className="flex items-center gap-1">
        <NumberField.Decrement render={<Button variant="ghost" size="icon-sm" aria-label={`Decrease ${label.toLowerCase()}`} />}>
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        </NumberField.Decrement>
        <InputGroup className="flex-1">
          <NumberField.Input
            render={<InputGroupInput aria-label={label} aria-invalid={invalid} placeholder={placeholder} className="text-center" />}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>{unit}</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <NumberField.Increment render={<Button variant="ghost" size="icon-sm" aria-label={`Increase ${label.toLowerCase()}`} />}>
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  )
}