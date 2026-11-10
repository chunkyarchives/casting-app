import { filmsApi } from '@/lib/api/films'
import type { FilmValues } from '@/lib/validation/film'
import type { Film, SaveFilmRequest } from '@/types/film'
import { optionalText } from './server-errors'

export const emptyFilmValues: FilmValues = {
  title: '',
  description: '',
  releaseYear: null,
  contentRating: null,
  status: 'Active',
  poster: { kind: 'none' },
}

export const toFilmValues = (film: Film): FilmValues => ({
  title: film.title,
  description: film.description ?? '',
  releaseYear: film.releaseYear,
  contentRating: film.contentRating,
  status: film.status,
  poster: film.posterUrl ? { kind: 'saved', url: film.posterUrl } : { kind: 'none' },
})

const toSaveFilmRequest = (values: FilmValues): SaveFilmRequest => ({
  title: values.title.trim(),
  description: optionalText(values.description),
  contentRating: values.contentRating,
  releaseYear: values.releaseYear,
})

export async function saveFilm(current: Film | null, values: FilmValues) {
  const request = toSaveFilmRequest(values)
  const saved = current
    ? await filmsApi.update(current.id, { ...request, status: values.status })
    : await filmsApi.create(request)

  let posterError: unknown = null
  try {
    if (values.poster.kind === 'new') await filmsApi.uploadPoster(saved.id, values.poster.picture)
    if (values.poster.kind === 'none' && saved.posterUrl) await filmsApi.removePoster(saved.id)
  } catch (error) {
    posterError = error
  }

  const film = values.poster.kind === 'saved' && !posterError ? saved : await filmsApi.get(saved.id)
  return { film, posterError }
}