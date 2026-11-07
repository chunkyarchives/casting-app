import type { Path, UseFormSetError } from 'react-hook-form'
import { actorsApi } from '@/lib/api/actors'
import { authApi } from '@/lib/api/auth'
import { ApiError } from '@/lib/api/http'
import { isCountryCode } from '@/lib/countries'
import { genders, type ActorProfileValues } from '@/lib/validation/actor'
import type { Actor, UpdateActorRequest } from '@/types/actor'

type Name = Pick<ActorProfileValues, 'firstName' | 'lastName'>

export const toActorProfileValues = (actor: Actor, name: Name): ActorProfileValues => ({
  firstName: name.firstName,
  lastName: name.lastName,
  dateOfBirth: actor.dateOfBirth,
  height: actor.height,
  weight: actor.weight,
  origin: actor.origin && isCountryCode(actor.origin) ? actor.origin.toUpperCase() : null,
  gender: genders.find((gender) => gender.toLowerCase() === actor.gender?.toLowerCase()) ?? null,
  bio: actor.bio ?? '',
  links: actor.links,
  roleInterests: actor.roleInterests,
})

export const toUpdateActorRequest = (values: ActorProfileValues): UpdateActorRequest => ({
  dateOfBirth: values.dateOfBirth,
  height: values.height,
  weight: values.weight,
  origin: values.origin,
  gender: values.gender,
  bio: values.bio.trim() || null,
  links: values.links,
  roleInterests: values.roleInterests,
})

const nameFields: (keyof Name)[] = ['firstName', 'lastName']

type DirtyFields = Partial<Record<keyof ActorProfileValues, unknown>>

const changesName = (dirty: DirtyFields) => nameFields.some((field) => dirty[field])

const changesActor = (dirty: DirtyFields) =>
  Object.keys(dirty).some((field) => !nameFields.includes(field as keyof Name))

export async function saveActorProfile(actorId: string, values: ActorProfileValues, dirty: DirtyFields, current: Actor) {
  const actor = changesActor(dirty) ? await actorsApi.update(actorId, toUpdateActorRequest(values)) : current
  if (changesName(dirty)) await authApi.updateName({ firstName: values.firstName, lastName: values.lastName })
  return actor
}

const toFieldPath = (serverKey: string) =>
  serverKey
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .map((part) => part.charAt(0).toLowerCase() + part.slice(1))
    .join('.')

export function showServerErrors(error: unknown, setError: UseFormSetError<ActorProfileValues>) {
  if (!(error instanceof ApiError) || error.status !== 400) return false

  const entries = Object.entries(error.fieldErrors)
  entries.forEach(([key, messages]) =>
    setError(toFieldPath(key) as Path<ActorProfileValues>, { message: messages[0] }),
  )
  return entries.length > 0
}