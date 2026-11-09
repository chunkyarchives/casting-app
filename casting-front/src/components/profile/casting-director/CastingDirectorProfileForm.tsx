import { zodResolver } from '@hookform/resolvers/zod'
import { SettingsGroup } from '@/components/settings/SettingsGroup'
import { Separator } from '@/components/ui/separator'
import { castingDirectorsApi } from '@/lib/api/casting-directors'
import { castingDirectorProfileSchema } from '@/lib/validation/casting-director'
import type { CastingDirector } from '@/types/casting-director'
import type { CurrentParticipant } from '@/types/participant'
import { ProfileCard } from '../ProfileCard'
import { ProfileForm } from '../form/ProfileForm'
import { useProfileForm } from '../form/useProfileForm'
import { castingDirectorChecklist, castingDirectorFacts } from '../profile-summary'
import { DateOfBirthRow } from '../rows/DateOfBirthRow'
import { GenderRow } from '../rows/GenderRow'
import { OriginRow } from '../rows/OriginRow'
import { NameRow } from '../rows/NameRow'
import { ProfilePictureRow } from '../rows/ProfilePictureRow'
import { toCastingDirectorProfileValues, toUpdateCastingDirectorRequest } from './casting-director-form'

type Props = {
  participant: CurrentParticipant
  castingDirector: CastingDirector
  onSaved: () => void
}

export function CastingDirectorProfileForm({ participant, castingDirector, onSaved }: Props) {
  const { form, saved, submit } = useProfileForm({
    profile: castingDirector,
    name: participant,
    resolver: zodResolver(castingDirectorProfileSchema),
    toValues: toCastingDirectorProfileValues,
    update: (values) => castingDirectorsApi.update(participant.id, toUpdateCastingDirectorRequest(values)),
    onSaved,
  })

  return (
    <ProfileForm
      id="casting-director-profile"
      form={form}
      onSubmit={submit}
      card={
        <ProfileCard
          participantId={participant.id}
          pictureUrl={participant.profilePictureUrl}
          name={`${participant.firstName} ${participant.lastName}`}
          email={participant.email}
          origin={saved.origin}
          facts={castingDirectorFacts(saved)}
          checklist={castingDirectorChecklist(saved)}
        />
      }
    >
      <SettingsGroup title="Identity">
        <ProfilePictureRow hasPicture={participant.profilePictureUrl !== null} required={false} />
        <NameRow />
      </SettingsGroup>

      <Separator />

      <SettingsGroup title="Details">
        <DateOfBirthRow />
        <GenderRow />
        <OriginRow required={false} />
      </SettingsGroup>
    </ProfileForm>
  )
}