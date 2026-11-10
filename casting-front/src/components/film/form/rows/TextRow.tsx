import { SettingsRow } from '@/components/settings/SettingsRow'
import { Input } from '@/components/ui/input'
import type { RowField } from './row-field'

type Props = {
  field: RowField<string>
  label: string
  hint: string
  maxLength: number
  placeholder?: string
  error?: string
}

export function TextRow({ field: { ref, name, value, onChange, onBlur }, label, hint, maxLength, placeholder, error }: Props) {
  return (
    <SettingsRow label={label} hint={hint} error={error}>
      <Input
        ref={ref}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-label={label}
        aria-invalid={error !== undefined}
        maxLength={maxLength}
        placeholder={placeholder}
        autoComplete="off"
      />
    </SettingsRow>
  )
}