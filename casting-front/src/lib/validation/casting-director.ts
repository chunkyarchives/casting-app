import * as z from 'zod'
import { personFields } from './profile'

export const castingDirectorProfileSchema = z.object(personFields)

export type CastingDirectorProfileValues = z.infer<typeof castingDirectorProfileSchema>