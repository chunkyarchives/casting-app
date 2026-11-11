import { forgetQuery, setCachedQuery, updateCachedQuery } from '@/hooks/useApiQuery'
import type { Film, FilmRole, FilmSummary } from '@/types/film'

export const myFilmsKey = 'director-films'
export const filmKey = (filmId: string) => `film-${filmId}`

const byName = (a: FilmRole, b: FilmRole) => a.name.localeCompare(b.name)

export const toFilmSummary = (film: Film): FilmSummary => ({
  id: film.id,
  directorId: film.directorId,
  title: film.title,
  contentRating: film.contentRating,
  releaseYear: film.releaseYear,
  status: film.status,
  createdAt: film.createdAt,
  roleCount: film.roles.length,
  posterUrl: film.posterUrl,
})

export function rememberFilm(film: Film) {
  const summary = toFilmSummary(film)
  setCachedQuery(filmKey(film.id), film)
  updateCachedQuery<FilmSummary[]>(myFilmsKey, (films) =>
    films.some((current) => current.id === film.id)
      ? films.map((current) => (current.id === film.id ? summary : current))
      : [...films, summary],
  )
}

export function forgetFilm(filmId: string) {
  forgetQuery(filmKey(filmId))
  updateCachedQuery<FilmSummary[]>(myFilmsKey, (films) => films.filter((film) => film.id !== filmId))
}

export function rememberRole(film: Film, role: FilmRole) {
  const roles = [...film.roles.filter((current) => current.id !== role.id), role].sort(byName)
  rememberFilm({ ...film, roles })
}

export function forgetRole(film: Film, roleId: string) {
  const next = { ...film, roles: film.roles.filter((role) => role.id !== roleId) }
  rememberFilm(next)
  return next
}