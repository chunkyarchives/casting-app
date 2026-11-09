import { useController } from 'react-hook-form'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { Textarea } from '@/components/ui/textarea'
import { bioMaxLength, type PersonValues } from '@/lib/validation/profile'

type Props = {
  placeholder: string
}

export function BioRow({ placeholder }: Props) {
  const { field, fieldState } = useController<PersonValues, 'bio'>({ name: 'bio' })

  return (
    <SettingsRow
      label="Bio"
      hint="A few words about you, shown under your name on your profile."
      error={fieldState.error?.message}
      align="start"
    >
      <Textarea
        {...field}
        aria-label="Bio"
        aria-invalid={fieldState.invalid}
        rows={4}
        maxLength={bioMaxLength}
        placeholder={placeholder}
      />
      <span className="self-end text-xs text-muted-foreground">
        {field.value.length} / {bioMaxLength}
      </span>
    </SettingsRow>
  )
}