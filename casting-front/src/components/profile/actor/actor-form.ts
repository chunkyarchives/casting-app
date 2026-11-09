import type { ActorProfileValues } from '@/lib/validation/actor'
import type { Actor, UpdateActorRequest } from '@/types/actor'
import { knownGender, knownOrigin, optionalText, type ProfileName } from '../form/profile-form'

export const toActorProfileValues = (actor: Actor, name: ProfileName): ActorProfileValues => ({
  firstName: name.firstName,
  lastName: name.lastName,
  dateOfBirth: actor.dateOfBirth,
  gender: knownGender(actor.gender),
  origin: knownOrigin(actor.origin),
  bio: actor.bio ?? '',
  height: actor.height,
  weight: actor.weight,
  links: actor.links,
  roleInterests: actor.roleInterests,
})

export const toUpdateActorRequest = (values: ActorProfileValues): UpdateActorRequest => ({
  dateOfBirth: values.dateOfBirth,
  gender: values.gender,
  origin: values.origin,
  bio: optionalText(values.bio),
  height: values.height,
  weight: values.weight,
  links: values.links,
  roleInterests: values.roleInterests,
})