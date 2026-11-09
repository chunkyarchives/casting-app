import { zodResolver } from '@hookform/resolvers/zod'
import { SettingsGroup } from '@/components/settings/SettingsGroup'
import { Separator } from '@/components/ui/separator'
import { actorsApi } from '@/lib/api/actors'
import { actorProfileSchema, heightRange, weightRange } from '@/lib/validation/actor'
import type { Actor } from '@/types/actor'
import type { CurrentParticipant } from '@/types/participant'
import { ProfileCard } from '../ProfileCard'
import { ProfileForm } from '../form/ProfileForm'
import { useProfileForm } from '../form/useProfileForm'
import { actorChecklist, actorFacts } from '../profile-summary'
import { BioRow } from '../rows/BioRow'
import { DateOfBirthRow } from '../rows/DateOfBirthRow'
import { GenderRow } from '../rows/GenderRow'
import { NameRow } from '../rows/NameRow'
import { OriginRow } from '../rows/OriginRow'
import { ProfilePictureRow } from '../rows/ProfilePictureRow'
import { toActorProfileValues, toUpdateActorRequest } from './actor-form'
import { LinksRow } from '../LinksRow'
import { MeasurementRow } from '../MeasurementRow'
import { RoleInterestsRow } from '../RoleInterestsRow'

type Props = {
  participant: CurrentParticipant
  actor: Actor
  onSaved: () => void
}

export function ActorProfileForm({ participant, actor, onSaved }: Props) {
  const { form, saved, submit } = useProfileForm({
    profile: actor,
    name: participant,
    resolver: zodResolver(actorProfileSchema),
    toValues: toActorProfileValues,
    update: (values) => actorsApi.update(participant.id, toUpdateActorRequest(values)),
    onSaved,
  })
  const hasPicture = participant.profilePictureUrl !== null

  return (
    <ProfileForm
      id="actor-profile"
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
          links={saved.links}
          facts={actorFacts(saved)}
          checklist={actorChecklist(saved, hasPicture)}
        />
      }
    >
      <SettingsGroup title="Identity">
        <ProfilePictureRow hasPicture={hasPicture} required />
        <NameRow />
      </SettingsGroup>

      <Separator />

      <SettingsGroup title="Details">
        <DateOfBirthRow />
        <GenderRow hint="Directors look for roles by gender, so it decides which roles you are matched with." />
        <OriginRow />
        <MeasurementRow
          name="height"
          label="Height"
          unit="cm"
          range={heightRange}
          placeholder="175"
          hint="In centimeters. Use the arrows, or type it in and use ↑ ↓ for small steps."
        />
        <MeasurementRow
          name="weight"
          label="Weight"
          unit="kg"
          range={weightRange}
          placeholder="70"
          hint="In kilograms. Use the arrows, or type it in and use ↑ ↓ for small steps."
        />
      </SettingsGroup>

      <Separator />

      <SettingsGroup title="About you">
        <BioRow placeholder="Your experience, training, the roles you have played…" />
        <LinksRow />
        <RoleInterestsRow />
      </SettingsGroup>
    </ProfileForm>
  )
}