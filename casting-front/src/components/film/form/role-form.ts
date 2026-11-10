import { filmRolesApi } from '@/lib/api/films'
import { isCountryCode } from '@/lib/countries'
import type { RoleValues } from '@/lib/validation/film'
import { genders } from '@/lib/validation/profile'
import type { FilmRole, SaveFilmRoleRequest } from '@/types/film'
import { optionalText } from './server-errors'

const knownGender = (gender: string | null) =>
  genders.find((option) => option.toLowerCase() === gender?.toLowerCase()) ?? null

const knownOrigin = (origin: string | null) => (origin && isCountryCode(origin) ? origin.toUpperCase() : null)

export const emptyRoleValues: RoleValues = {
  name: '',
  description: '',
  ageMin: null,
  ageMax: null,
  heightMin: null,
  heightMax: null,
  weightMin: null,
  weightMax: null,
  gender: null,
  origin: null,
  conceptArt: [],
}

export const toRoleValues = (role: FilmRole): RoleValues => ({
  name: role.name,
  description: role.description ?? '',
  ageMin: role.ageMin,
  ageMax: role.ageMax,
  heightMin: role.heightMin,
  heightMax: role.heightMax,
  weightMin: role.weightMin,
  weightMax: role.weightMax,
  gender: knownGender(role.gender),
  origin: knownOrigin(role.origin),
  conceptArt: role.conceptArt.map((media) => ({ kind: 'saved', media })),
})

const toSaveRoleRequest = (values: RoleValues): SaveFilmRoleRequest => ({
  name: values.name.trim(),
  description: optionalText(values.description),
  ageMin: values.ageMin,
  ageMax: values.ageMax,
  heightMin: values.heightMin,
  heightMax: values.heightMax,
  weightMin: values.weightMin,
  weightMax: values.weightMax,
  gender: values.gender,
  origin: values.origin,
})

export async function saveRole(filmId: string, current: FilmRole | null, values: RoleValues) {
  const request = toSaveRoleRequest(values)
  const saved = current
    ? await filmRolesApi.update(current.id, { ...request, rowVersion: current.rowVersion })
    : await filmRolesApi.create(filmId, request)

  const kept = new Set(values.conceptArt.flatMap((art) => (art.kind === 'saved' ? [art.media.id] : [])))
  const removed = (current?.conceptArt ?? []).filter((media) => !kept.has(media.id))
  const added = values.conceptArt.flatMap((art) => (art.kind === 'new' ? [art] : []))

  let artError: unknown = null
  try {
    for (const media of removed) await filmRolesApi.removeConceptArt(saved.id, media.id)
    for (const art of added) await filmRolesApi.addConceptArt(saved.id, art.picture, optionalText(art.caption))
  } catch (error) {
    artError = error
  }

  const role = removed.length > 0 || added.length > 0 ? await filmRolesApi.get(saved.id) : saved
  return { role, artError }
}