import { FemaleSymbolIcon, MaleSymbolIcon } from '@hugeicons/core-free-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useController, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { ChoiceRow, type Choice } from '@/components/film/form/rows/ChoiceRow'
import { ConceptArtRow } from '@/components/film/form/rows/ConceptArtRow'
import { DeleteRow } from '@/components/film/form/rows/DeleteRow'
import { LongTextRow } from '@/components/film/form/rows/LongTextRow'
import { OriginRow } from '@/components/film/form/rows/OriginRow'
import { RangeRow } from '@/components/film/form/rows/RangeRow'
import { TextRow } from '@/components/film/form/rows/TextRow'
import { forgetRole, rememberRole } from '@/components/film/hooks/film-cache'
import { SettingsGroup } from '@/components/settings/SettingsGroup'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/toast'
import { apiErrorMessage } from '@/lib/api/errors'
import { filmRolesApi } from '@/lib/api/films'
import { filmPaths } from '@/lib/routes'
import {
  roleAgeRange,
  roleDescriptionMaxLength,
  roleHeightRange,
  roleNameMaxLength,
  roleSchema,
  roleWeightRange,
  type RoleValues,
} from '@/lib/validation/film'
import type { genders } from '@/lib/validation/profile'
import type { Film, FilmRole } from '@/types/film'
import { EditorForm } from './EditorForm'
import { emptyRoleValues, saveRole, toRoleValues } from './role-form'
import { showServerErrors } from './server-errors'

const genderChoices: Choice<(typeof genders)[number]>[] = [
  { value: 'Male', label: 'Male', icon: MaleSymbolIcon },
  { value: 'Female', label: 'Female', icon: FemaleSymbolIcon },
]

type Props = {
  film: Film
  role: FilmRole | null
}

export function RoleForm({ film, role }: Props) {
  const navigate = useNavigate()
  const form = useForm<RoleValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: role ? toRoleValues(role) : emptyRoleValues,
    mode: 'onTouched',
  })
  const control = form.control
  const ageMin = useController({ control, name: 'ageMin' })
  const ageMax = useController({ control, name: 'ageMax' })
  const heightMin = useController({ control, name: 'heightMin' })
  const heightMax = useController({ control, name: 'heightMax' })
  const weightMin = useController({ control, name: 'weightMin' })
  const weightMax = useController({ control, name: 'weightMax' })

  const save = async (values: RoleValues) => {
    const result = await saveRole(film.id, role, values).catch((error: unknown) => {
      if (!showServerErrors(error, form.setError)) {
        toast.add({ type: 'error', title: 'The role could not be saved', description: apiErrorMessage(error) })
      }
      return null
    })
    if (!result) return

    rememberRole(film, result.role)
    form.reset(toRoleValues(result.role))

    if (result.artError) {
      toast.add({
        type: 'error',
        title: 'The role is saved, but some concept art is not',
        description: apiErrorMessage(result.artError),
      })
      void navigate(filmPaths.editRole(film.id, result.role.id), { replace: true })
      return
    }

    toast.add({ type: 'success', title: role ? 'Role saved' : 'Role created' })
    void navigate(filmPaths.film(film.id), { replace: !role })
  }

  const remove = async () => {
    if (!role) return
    await filmRolesApi.remove(role.id)
    form.reset()
    forgetRole(film, role.id)
    toast.add({ type: 'success', title: `${role.name} was deleted` })
    void navigate(filmPaths.film(film.id), { replace: true })
  }

  return (
    <EditorForm
      id="role-editor"
      form={form}
      defaultHint={
        role
          ? 'Point at a setting to see what it is for. Your changes are saved together when you press Save.'
          : `Point at a setting to see what it is for. The role is added to ${film.title} when you press Save.`
      }
      onSubmit={form.handleSubmit(save)}
    >
      <SettingsGroup title="Role">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <TextRow
              field={field}
              label="Name"
              hint="The character's name, shown on the role card."
              maxLength={roleNameMaxLength}
              placeholder="Character Name"
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <LongTextRow
              field={field}
              label="Description"
              hint="Who the character is and what the part asks of the actor."
              maxLength={roleDescriptionMaxLength}
              placeholder="Character Description"
              error={fieldState.error?.message}
            />
          )}
        />
      </SettingsGroup>

      <Separator />

      <SettingsGroup title="Who you're looking for">
        <Controller
          name="gender"
          control={control}
          render={({ field, fieldState }) => (
            <ChoiceRow
              field={field}
              label="Gender"
              hint="Pick Any if the part is open to everyone."
              choices={genderChoices}
              emptyLabel="Any"
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="origin"
          control={control}
          render={({ field, fieldState }) => (
            <OriginRow
              field={field}
              hint="The country the actor should come from. Leave it empty if it doesn't matter."
              error={fieldState.error?.message}
            />
          )}
        />
        <RangeRow
          low={ageMin.field}
          high={ageMax.field}
          label="Age"
          hint="The playing age. Fill in one side only for an open range, like 30 and older."
          range={roleAgeRange}
          unit="yrs"
          error={ageMin.fieldState.error?.message ?? ageMax.fieldState.error?.message}
        />
        <RangeRow
          low={heightMin.field}
          high={heightMax.field}
          label="Height"
          hint="The actor's height in centimetres."
          range={roleHeightRange}
          unit="cm"
          error={heightMin.fieldState.error?.message ?? heightMax.fieldState.error?.message}
        />
        <RangeRow
          low={weightMin.field}
          high={weightMax.field}
          label="Weight"
          hint="The actor's weight in kilograms."
          range={roleWeightRange}
          unit="kg"
          error={weightMin.fieldState.error?.message ?? weightMax.fieldState.error?.message}
        />
      </SettingsGroup>

      <Separator />

      <SettingsGroup title="Look">
        <Controller
          name="conceptArt"
          control={control}
          render={({ field, fieldState }) => <ConceptArtRow field={field} error={fieldState.error?.message} />}
        />
      </SettingsGroup>

      {role && (
        <>
          <Separator />
          <SettingsGroup title="Danger zone">
            <DeleteRow
              label="Delete role"
              hint="Removes the role with its concept art and every application for it."
              title={`Delete ${role.name}?`}
              description="The role, its concept art and every application for it are removed. This can't be undone."
              onDelete={remove}
            />
          </SettingsGroup>
        </>
      )}
    </EditorForm>
  )
}