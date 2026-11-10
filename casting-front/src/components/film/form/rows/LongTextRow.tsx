import { SettingsRow } from '@/components/settings/SettingsRow'
import { Textarea } from '@/components/ui/textarea'
import type { RowField } from './row-field'

type Props = {
  field: RowField<string>
  label: string
  hint: string
  maxLength: number
  placeholder?: string
  error?: string
}

export function LongTextRow({ field: { ref, name, value, onChange, onBlur }, label, hint, maxLength, placeholder, error }: Props) {
  return (
    <SettingsRow label={label} hint={hint} error={error} align="start">
      <Textarea
        ref={ref}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-label={label}
        aria-invalid={error !== undefined}
        rows={5}
        maxLength={maxLength}
        placeholder={placeholder}
      />
      <span className="self-end text-xs text-muted-foreground tabular-nums">
        {value.length} / {maxLength}
      </span>
    </SettingsRow>
  )
}