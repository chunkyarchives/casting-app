import { FemaleSymbolIcon, MaleSymbolIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useController } from 'react-hook-form'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { genders, type PersonValues } from '@/lib/validation/profile'

const genderIcons = {
  Male: MaleSymbolIcon,
  Female: FemaleSymbolIcon,
}

type Props = {
  hint?: string
}

export function GenderRow({ hint = 'Shown on your profile, next to your age.' }: Props) {
  const { field, fieldState } = useController<PersonValues, 'gender'>({ name: 'gender' })

  return (
    <SettingsRow label="Gender" hint={hint} missing={!field.value} error={fieldState.error?.message}>
      <ToggleGroup
        variant="outline"
        aria-label="Gender"
        className="w-full *:flex-1 *:aria-pressed:border-primary *:aria-pressed:text-foreground"
        value={field.value ? [field.value] : []}
        onValueChange={(next) => next.length > 0 && field.onChange(next[next.length - 1])}
      >
        {genders.map((gender) => (
          <ToggleGroupItem key={gender} value={gender}>
            <HugeiconsIcon icon={genderIcons[gender]} strokeWidth={2} />
            {gender}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </SettingsRow>
  )
}