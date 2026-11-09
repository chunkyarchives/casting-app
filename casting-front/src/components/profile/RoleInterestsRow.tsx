import { useController } from 'react-hook-form'
import { TagInput } from '@/components/common/form/TagInput'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { maxRoleInterests, roleInterestMaxLength, type ActorProfileValues } from '@/lib/validation/actor'

export function RoleInterestsRow() {
  const { field } = useController<ActorProfileValues, 'roleInterests'>({ name: 'roleInterests' })

  return (
    <SettingsRow
      label="Role interests"
      hint={`Kinds of roles you would like to play, like Detective or Period drama. Up to ${maxRoleInterests}; press Enter to add one.`}
      align="start"
    >
      <TagInput
        label="Role interests"
        value={field.value}
        onChange={field.onChange}
        max={maxRoleInterests}
        maxLength={roleInterestMaxLength}
        placeholder="Add a kind of role"
      />
    </SettingsRow>
  )
}