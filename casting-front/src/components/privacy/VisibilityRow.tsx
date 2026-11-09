import { ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useController } from 'react-hook-form'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { VisibilityValues } from '@/lib/validation/account'

export function VisibilityRow() {
  const { field } = useController<VisibilityValues, 'isProfilePublic'>({ name: 'isProfilePublic' })

  return (
    <SettingsRow
      label="Profile"
      hint="Public puts your name, picture, origin, age and bio on the Network page for everyone. Private keeps them for the people you work with."
    >
      <ToggleGroup
        variant="outline"
        aria-label="Profile visibility"
        className="w-full *:flex-1 *:aria-pressed:border-primary *:aria-pressed:text-foreground"
        value={[field.value ? 'public' : 'private']}
        onValueChange={(next) => next.length > 0 && field.onChange(next[next.length - 1] === 'public')}
      >
        <ToggleGroupItem value="private">
          <HugeiconsIcon icon={ViewOffIcon} strokeWidth={2} />
          Private
        </ToggleGroupItem>
        <ToggleGroupItem value="public">
          <HugeiconsIcon icon={ViewIcon} strokeWidth={2} />
          Public
        </ToggleGroupItem>
      </ToggleGroup>
    </SettingsRow>
  )
}