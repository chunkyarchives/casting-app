import { zodResolver } from '@hookform/resolvers/zod'
import { SettingsGroup } from '@/components/settings/SettingsGroup'
import { Separator } from '@/components/ui/separator'
import { directorsApi } from '@/lib/api/directors'
import { directorProfileSchema } from '@/lib/validation/director'
import type { Director } from '@/types/director'
import type { CurrentParticipant } from '@/types/participant'
import { ProfileCard } from '../ProfileCard'
import { ProfileForm } from '../form/ProfileForm'
import { useProfileForm } from '../form/useProfileForm'
import { directorChecklist, directorFacts } from '../profile-summary'
import { BioRow } from '../rows/BioRow'
import { DateOfBirthRow } from '../rows/DateOfBirthRow'
import { GenderRow } from '../rows/GenderRow'
import { NameRow } from '../rows/NameRow'
import { OriginRow } from '../rows/OriginRow'
import { ProfilePictureRow } from '../rows/ProfilePictureRow'
import { toDirectorProfileValues, toUpdateDirectorRequest } from './director-form'

type Props = {
  participant: CurrentParticipant
  director: Director
  onSaved: () => void
}

export function DirectorProfileForm({ participant, director, onSaved }: Props) {
  const { form, saved, submit } = useProfileForm({
    profile: director,
    name: participant,
    resolver: zodResolver(directorProfileSchema),
    toValues: toDirectorProfileValues,
    update: (values) => directorsApi.update(participant.id, toUpdateDirectorRequest(values)),
    onSaved,
  })

  return (
    <ProfileForm
      id="director-profile"
      form={form}
      onSubmit={submit}
      card={
        <ProfileCard
          participantId={participant.id}
          pictureUrl={participant.profilePictureUrl}
          name={`${participant.firstName} ${participant.lastName}`}
          email={participant.email}
          origin={saved.origin}
          bio={saved.bio}
          facts={directorFacts(saved)}
          checklist={directorChecklist(saved)}
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
        <OriginRow />
      </SettingsGroup>

      <Separator />

      <SettingsGroup title="About you">
        <BioRow placeholder="Your films, your style and the actors you like to work with…" />
      </SettingsGroup>
    </ProfileForm>
  )
}