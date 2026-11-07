import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { subYears } from 'date-fns'
import { Add01Icon, Cancel01Icon, FemaleSymbolIcon, MaleSymbolIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useSession } from '@/components/auth/session/session-context'
import { CountryCombobox } from '@/components/common/form/CountryCombobox'
import { DatePicker } from '@/components/common/form/DatePicker'
import { TagInput } from '@/components/common/form/TagInput'
import { NumberStepper } from '@/components/settings/NumberStepper'
import { SettingsFooter } from '@/components/settings/SettingsFooter'
import { SettingsGroup } from '@/components/settings/SettingsGroup'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { apiErrorMessage } from '@/lib/api/errors'
import {
  actorProfileSchema,
  bioMaxLength,
  earliestBirthDate,
  heightRange,
  maxLinks,
  maxRoleInterests,
  roleInterestMaxLength,
  todayIso,
  weightRange,
  type ActorProfileValues,
} from '@/lib/validation/actor'
import type { Actor } from '@/types/actor'
import type { CurrentParticipant } from '@/types/participant'
import { ProfileCard } from '../ProfileCard'
import { ProfilePictureRow } from '../ProfilePictureRow'
import { actorChecklist, actorFacts } from '../actor-profile'
import { saveActorProfile, showServerErrors, toActorProfileValues } from './actor-form'

const formId = 'actor-profile'
const typicalBirthMonth = subYears(new Date(), 25)

type Props = {
  participant: CurrentParticipant
  actor: Actor
  onSaved: () => void
}

export function ActorProfileForm({ participant, actor, onSaved }: Props) {
  const { refresh } = useSession()
  const [saved, setSaved] = useState(actor)
  const [hint, setHint] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, isSubmitting, dirtyFields },
  } = useForm<ActorProfileValues>({
    resolver: zodResolver(actorProfileSchema),
    defaultValues: toActorProfileValues(actor, participant),
    mode: 'onTouched',
  })
  const links = useFieldArray({ control, name: 'links' })
  const [dateOfBirth, gender, origin, height, weight, bio] = useWatch({
    control,
    name: ['dateOfBirth', 'gender', 'origin', 'height', 'weight', 'bio'],
  })

  useEffect(() => {
    if (!isDirty) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [isDirty])

  const save = async (next: ActorProfileValues) => {
    try {
      const updated = await saveActorProfile(participant.id, next, dirtyFields, saved)
      await refresh()
      setSaved(updated)
      reset(toActorProfileValues(updated, next))
      onSaved()
      toast.add({ type: 'success', title: 'Profile saved' })
    } catch (error) {
      if (!showServerErrors(error, setError)) {
        toast.add({ type: 'error', title: 'Your profile could not be saved', description: apiErrorMessage(error) })
      }
    }
  }

  const hasPicture = participant.profilePictureUrl !== null

  return (
    <>
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

      <Separator />

      <form id={formId} noValidate onSubmit={handleSubmit(save)} className="flex flex-col gap-6">
        <SettingsGroup title="Identity">
          <ProfilePictureRow hasPicture={hasPicture} required onHint={setHint} />
          <SettingsRow
            label="Name"
            hint="Your first and last name, as directors and casting directors see them."
            error={errors.firstName?.message ?? errors.lastName?.message}
            onHint={setHint}
          >
            <div className="grid grid-cols-2 gap-2">
              <Controller
                control={control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <Input {...field} aria-label="First name" aria-invalid={fieldState.invalid} autoComplete="given-name" className="text-center" maxLength={100} />
                )}
              />
              <Controller
                control={control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <Input {...field} aria-label="Last name" aria-invalid={fieldState.invalid} autoComplete="family-name" className="text-center" maxLength={100} />
                )}
              />
            </div>
          </SettingsRow>
        </SettingsGroup>

        <Separator />

        <SettingsGroup title="Details">
          <SettingsRow
            label="Date of birth"
            hint="Only you and the admins see the date. Everyone else sees your age."
            missing={!dateOfBirth}
            error={errors.dateOfBirth?.message}
            onHint={setHint}
          >
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <DatePicker
                  label="Date of birth"
                  align="center"
                  value={field.value}
                  onChange={field.onChange}
                  min={earliestBirthDate}
                  max={todayIso()}
                  defaultMonth={typicalBirthMonth}
                  invalid={Boolean(errors.dateOfBirth)}
                />
              )}
            />
          </SettingsRow>

          <SettingsRow
            label="Gender"
            hint="Directors look for roles by gender, so it decides which roles you are matched with."
            missing={!gender}
            error={errors.gender?.message}
            onHint={setHint}
          >
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <ToggleGroup
                  variant="outline"
                  aria-label="Gender"
                  className="w-full *:flex-1 *:aria-pressed:border-primary *:aria-pressed:text-foreground"
                  value={field.value ? [field.value] : []}
                  onValueChange={(next) => next.length > 0 && field.onChange(next[next.length - 1])}
                >
                  <ToggleGroupItem value="Male">
                    <HugeiconsIcon icon={MaleSymbolIcon} strokeWidth={2} />
                    Male
                  </ToggleGroupItem>
                  <ToggleGroupItem value="Female">
                    <HugeiconsIcon icon={FemaleSymbolIcon} strokeWidth={2} />
                    Female
                  </ToggleGroupItem>
                </ToggleGroup>
              )}
            />
          </SettingsRow>

          <SettingsRow
            label="Origin"
            hint="Your country of origin. Its flag is shown on your profile."
            missing={!origin}
            error={errors.origin?.message}
            onHint={setHint}
          >
            <Controller
              control={control}
              name="origin"
              render={({ field }) => (
                <CountryCombobox label="Origin" value={field.value} align="center" onChange={field.onChange} invalid={Boolean(errors.origin)} />
              )}
            />
          </SettingsRow>

          <SettingsRow
            label="Height"
            hint="In centimeters. Use the arrows, or type it in and use ↑ ↓ for small steps."
            missing={!height}
            error={errors.height?.message}
            onHint={setHint}
          >
            <Controller
              control={control}
              name="height"
              render={({ field }) => (
                <NumberStepper
                  label="Height"
                  value={field.value}
                  onChange={field.onChange}
                  min={heightRange.min}
                  max={heightRange.max}
                  unit="cm"
                  placeholder="175"
                  invalid={Boolean(errors.height)}
                />
              )}
            />
          </SettingsRow>

          <SettingsRow
            label="Weight"
            hint="In kilograms. Use the arrows, or type it in and use ↑ ↓ for small steps."
            missing={!weight}
            error={errors.weight?.message}
            onHint={setHint}
          >
            <Controller
              control={control}
              name="weight"
              render={({ field }) => (
                <NumberStepper
                  label="Weight"
                  value={field.value}
                  onChange={field.onChange}
                  min={weightRange.min}
                  max={weightRange.max}
                  unit="kg"
                  placeholder="70"
                  invalid={Boolean(errors.weight)}
                />
              )}
            />
          </SettingsRow>
        </SettingsGroup>

        <Separator />

        <SettingsGroup title="About you">
          <SettingsRow
            label="Bio"
            hint="A few words about you, shown under your name on your profile."
            error={errors.bio?.message}
            align="start"
            onHint={setHint}
          >
            <Controller
              control={control}
              name="bio"
              render={({ field, fieldState }) => (
                <Textarea
                  {...field}
                  aria-label="Bio"
                  aria-invalid={fieldState.invalid}
                  rows={4}
                  maxLength={bioMaxLength}
                  placeholder="Your experience, training, the roles you have played…"
                />
              )}
            />
            <span className="self-end text-xs text-muted-foreground">
              {bio.length} / {bioMaxLength}
            </span>
          </SettingsRow>

          <SettingsRow
            label="Links"
            hint={`Your portfolio, IMDb, social media or showreel. Up to ${maxLinks}, each a full https:// link.`}
            align="start"
            onHint={setHint}
          >
            {links.fields.length > 0 && (
              <ul className="flex flex-col gap-2">
                {links.fields.map((link, index) => {
                  const linkErrors = errors.links?.[index]
                  return (
                    <li key={link.id} className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Controller
                          control={control}
                          name={`links.${index}.label`}
                          render={({ field, fieldState }) => (
                            <Input
                              {...field}
                              aria-label={`Name of link ${index + 1}`}
                              aria-invalid={fieldState.invalid}
                              placeholder="Name, e.g. IMDb"
                              maxLength={50}
                              className="w-28 shrink-0 sm:w-40"
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name={`links.${index}.url`}
                          render={({ field, fieldState }) => (
                            <Input
                              {...field}
                              aria-label={`Address of link ${index + 1}`}
                              aria-invalid={fieldState.invalid}
                              type="url"
                              placeholder="https://"
                              maxLength={500}
                              className="min-w-0 flex-1"
                            />
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Remove link ${index + 1}`}
                          onClick={() => links.remove(index)}
                        >
                          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                        </Button>
                      </div>
                      {(linkErrors?.label || linkErrors?.url) && (
                        <p role="alert" className="text-xs text-destructive">
                          {linkErrors.label?.message ?? linkErrors.url?.message}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              disabled={links.fields.length >= maxLinks}
              onClick={() => links.append({ label: '', url: '' })}
            >
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
              Add link
            </Button>
          </SettingsRow>

          <SettingsRow
            label="Role interests"
            hint={`Kinds of roles you would like to play, like Detective or Period drama. Up to ${maxRoleInterests}; press Enter to add one.`}
            align="start"
            onHint={setHint}
          >
            <Controller
              control={control}
              name="roleInterests"
              render={({ field }) => (
                <TagInput
                  label="Role interests"
                  value={field.value}
                  onChange={field.onChange}
                  max={maxRoleInterests}
                  maxLength={roleInterestMaxLength}
                  placeholder="Add a kind of role"
                />
              )}
            />
          </SettingsRow>
        </SettingsGroup>
      </form>

      <SettingsFooter
        hint={hint}
        defaultHint="Point at a setting to see what it is for. Your changes are saved together when you press Save."
        dirty={isDirty}
        saving={isSubmitting}
        formId={formId}
        onDiscard={() => reset()}
      />
    </>
  )
}