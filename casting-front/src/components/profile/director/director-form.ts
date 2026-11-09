import type { DirectorProfileValues } from '@/lib/validation/director'
import type { Director, UpdateDirectorRequest } from '@/types/director'
import { knownGender, knownOrigin, optionalText, type ProfileName } from '../form/profile-form'

export const toDirectorProfileValues = (director: Director, name: ProfileName): DirectorProfileValues => ({
  firstName: name.firstName,
  lastName: name.lastName,
  dateOfBirth: director.dateOfBirth,
  gender: knownGender(director.gender),
  origin: knownOrigin(director.origin),
  bio: director.bio ?? '',
})

export const toUpdateDirectorRequest = (values: DirectorProfileValues): UpdateDirectorRequest => ({
  dateOfBirth: values.dateOfBirth,
  gender: values.gender,
  origin: values.origin,
  bio: optionalText(values.bio),
})