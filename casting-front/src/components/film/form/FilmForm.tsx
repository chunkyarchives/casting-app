import { Archive02Icon, Film01Icon } from '@hugeicons/core-free-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { ChoiceRow, type Choice } from '@/components/film/form/rows/ChoiceRow'
import { DeleteRow } from '@/components/film/form/rows/DeleteRow'
import { LongTextRow } from '@/components/film/form/rows/LongTextRow'
import { NumberRow } from '@/components/film/form/rows/NumberRow'
import { PosterRow } from '@/components/film/form/rows/PosterRow'
import { TextRow } from '@/components/film/form/rows/TextRow'
import { forgetFilm, rememberFilm } from '@/components/film/hooks/film-cache'
import { SettingsGroup } from '@/components/settings/SettingsGroup'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/toast'
import { apiErrorMessage } from '@/lib/api/errors'
import { filmsApi } from '@/lib/api/films'
import { filmPaths } from '@/lib/routes'
import {
  contentRatings,
  filmDescriptionMaxLength,
  filmSchema,
  filmTitleMaxLength,
  releaseYearRange,
  type FilmValues,
} from '@/lib/validation/film'
import type { Film } from '@/types/film'
import { EditorForm } from './EditorForm'
import { emptyFilmValues, saveFilm, toFilmValues } from './film-form'
import { showServerErrors } from './server-errors'

const statusChoices: Choice<Film['status']>[] = [
  { value: 'Active', label: 'Active', icon: Film01Icon },
  { value: 'Archived', label: 'Archived', icon: Archive02Icon },
]

const ratingChoices = (current: string | null): Choice<string>[] => {
  const known: string[] = [...contentRatings]
  const options = current && !known.includes(current) ? [...known, current] : known
  return options.map((rating) => ({ value: rating, label: rating }))
}

export function FilmForm({ film }: { film: Film | null }) {
  const navigate = useNavigate()
  const form = useForm<FilmValues>({
    resolver: zodResolver(filmSchema),
    defaultValues: film ? toFilmValues(film) : emptyFilmValues,
    mode: 'onTouched',
  })

  const save = async (values: FilmValues) => {
    const result = await saveFilm(film, values).catch((error: unknown) => {
      if (!showServerErrors(error, form.setError)) {
        toast.add({ type: 'error', title: 'The film could not be saved', description: apiErrorMessage(error) })
      }
      return null
    })
    if (!result) return

    rememberFilm(result.film)
    form.reset(toFilmValues(result.film))

    if (result.posterError) {
      toast.add({
        type: 'error',
        title: 'The film is saved, but the poster is not',
        description: apiErrorMessage(result.posterError),
      })
      void navigate(filmPaths.edit(result.film.id), { replace: true })
      return
    }

    toast.add({ type: 'success', title: film ? 'Film saved' : 'Film created' })
    void navigate(filmPaths.film(result.film.id), { replace: !film })
  }

  const remove = async () => {
    if (!film) return
    await filmsApi.remove(film.id)
    form.reset()
    forgetFilm(film.id)
    toast.add({ type: 'success', title: `${film.title} was deleted` })
    void navigate(filmPaths.library, { replace: true })
  }

  return (
    <EditorForm
      id="film-editor"
      form={form}
      defaultHint={
        film
          ? 'Point at a setting to see what it is for. Your changes are saved together when you press Save.'
          : 'Point at a setting to see what it is for. The film is created when you press Save.'
      }
      onSubmit={form.handleSubmit(save)}
    >
      <SettingsGroup title="Film">
        <Controller name="poster" control={form.control} render={({ field }) => <PosterRow field={field} />} />
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextRow
              field={field}
              label="Title"
              hint="The name of the film, as actors and casting directors see it."
              maxLength={filmTitleMaxLength}
              placeholder="Film Title"
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="releaseYear"
          control={form.control}
          render={({ field, fieldState }) => (
            <NumberRow
              field={field}
              label="Release year"
              hint="The year the film is planned to come out. Leave it empty if you don't know yet."
              range={releaseYearRange}
              placeholder="Not set"
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name="contentRating"
          control={form.control}
          render={({ field, fieldState }) => (
            <ChoiceRow
              field={field}
              label="Content rating"
              hint="Who the film is meant for. Pick None if it isn't rated yet."
              choices={ratingChoices(film?.contentRating ?? null)}
              emptyLabel="None"
              error={fieldState.error?.message}
            />
          )}
        />
        {film && (
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <ChoiceRow
                field={field}
                label="Status"
                hint="Archived films stay in your library, but they can't get new roles."
                choices={statusChoices}
              />
            )}
          />
        )}
      </SettingsGroup>

      <Separator />

      <SettingsGroup title="About">
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <LongTextRow
              field={field}
              label="Description"
              hint="The story, the tone and anything else actors should know about the film."
              maxLength={filmDescriptionMaxLength}
              placeholder="What the film is about…"
              error={fieldState.error?.message}
            />
          )}
        />
      </SettingsGroup>

      {film && (
        <>
          <Separator />
          <SettingsGroup title="Danger zone">
            <DeleteRow
              label="Delete film"
              hint="Removes the film with its poster, roles, concept art and applications."
              title={`Delete ${film.title}?`}
              description="The film, its poster, all of its roles and every application for them are removed. This can't be undone."
              onDelete={remove}
            />
          </SettingsGroup>
        </>
      )}
    </EditorForm>
  )
}