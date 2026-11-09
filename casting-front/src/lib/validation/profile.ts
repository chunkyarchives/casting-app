import { format } from 'date-fns'
import * as z from 'zod'
import { isCountryCode } from '@/lib/countries'
import { nameChars } from './auth'

export const genders = ['Male', 'Female'] as const
export const bioMaxLength = 4000
export const earliestBirthDate = '1900-01-01'

export const todayIso = () => format(new Date(), 'yyyy-MM-dd')

const personName = (field: string) =>
  z
    .string()
    .trim()
    .min(1, `Enter your ${field}`)
    .max(100, `Your ${field} is too long`)
    .regex(nameChars, 'Use letters, spaces, apostrophes, hyphens and dots only')

export const personFields = {
  firstName: personName('first name'),
  lastName: personName('last name'),
  dateOfBirth: z
    .string()
    .nullable()
    .refine((date) => date === null || (date >= earliestBirthDate && date <= todayIso()), 'Pick a date between 1900 and today'),
  gender: z.enum(genders).nullable(),
}

export const originField = z
  .string()
  .nullable()
  .refine((code) => code === null || isCountryCode(code), 'Pick a country from the list')

export const bioField = z.string().max(bioMaxLength, 'Your bio is too long')

const personSchema = z.object({ ...personFields, origin: originField, bio: bioField })

export type PersonValues = z.infer<typeof personSchema>