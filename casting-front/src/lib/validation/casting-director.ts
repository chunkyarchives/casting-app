import * as z from 'zod'
import { originField, personFields } from './profile'

export const castingDirectorProfileSchema = z.object({
  ...personFields,
  origin: originField,
})

export type CastingDirectorProfileValues = z.infer<typeof castingDirectorProfileSchema>