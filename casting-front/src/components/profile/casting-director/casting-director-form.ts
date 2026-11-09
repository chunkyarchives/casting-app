import type { CastingDirectorProfileValues } from '@/lib/validation/casting-director'
import type { CastingDirector, UpdateCastingDirectorRequest } from '@/types/casting-director'
import { knownGender, knownOrigin, type ProfileName } from '../form/profile-form'

export const toCastingDirectorProfileValues = ( castingDirector: CastingDirector, name: ProfileName): CastingDirectorProfileValues => ({
  firstName: name.firstName,
  lastName: name.lastName,
  dateOfBirth: castingDirector.dateOfBirth,
  gender: knownGender(castingDirector.gender),
  origin: knownOrigin(castingDirector.origin),
})

export const toUpdateCastingDirectorRequest = (values: CastingDirectorProfileValues): UpdateCastingDirectorRequest => ({
  dateOfBirth: values.dateOfBirth,
  gender: values.gender,
  origin: values.origin,
})