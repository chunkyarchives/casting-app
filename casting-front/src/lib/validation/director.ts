import * as z from 'zod'
import { bioField, originField, personFields } from './profile'

export const directorProfileSchema = z.object({
  ...personFields,
  origin: originField,
  bio: bioField,
})

export type DirectorProfileValues = z.infer<typeof directorProfileSchema>