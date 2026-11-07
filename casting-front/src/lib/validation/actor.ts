import { format } from 'date-fns'
import * as z from 'zod'
import { isCountryCode } from '@/lib/countries'
import { nameChars } from './auth'

export const genders = ['Male', 'Female'] as const

export const heightRange = { min: 50, max: 260 }
export const weightRange = { min: 20, max: 500 }
export const bioMaxLength = 4000
export const maxLinks = 10
export const maxRoleInterests = 20
export const roleInterestMaxLength = 50
export const earliestBirthDate = '1900-01-01'

export const todayIso = () => format(new Date(), 'yyyy-MM-dd')

const personName = (field: string) =>
  z
    .string()
    .trim()
    .min(1, `Enter your ${field}`)
    .max(100, `Your ${field} is too long`)
    .regex(nameChars, 'Use letters, spaces, apostrophes, hyphens and dots only')

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export const actorProfileSchema = z.object({
  firstName: personName('first name'),
  lastName: personName('last name'),
  dateOfBirth: z
    .string()
    .nullable()
    .refine((date) => date === null || (date >= earliestBirthDate && date <= todayIso()), 'Pick a date between 1900 and today'),
  height: z
    .number()
    .int('Enter a whole number')
    .min(heightRange.min, `Enter a height between ${heightRange.min} and ${heightRange.max} cm`)
    .max(heightRange.max, `Enter a height between ${heightRange.min} and ${heightRange.max} cm`)
    .nullable(),
  weight: z
    .number()
    .int('Enter a whole number')
    .min(weightRange.min, `Enter a weight between ${weightRange.min} and ${weightRange.max} kg`)
    .max(weightRange.max, `Enter a weight between ${weightRange.min} and ${weightRange.max} kg`)
    .nullable(),
  origin: z.string().nullable().refine((code) => code === null || isCountryCode(code), 'Pick a country from the list'),
  gender: z.enum(genders).nullable(),
  bio: z.string().max(bioMaxLength, 'Your bio is too long'),
  links: z
    .array(
      z.object({
        label: z.string().trim().min(1, 'Name the link').max(50, 'Keep the name under 50 characters'),
        url: z
          .string()
          .trim()
          .min(1, 'Enter the link')
          .max(500, 'This link is too long')
          .refine(isHttpUrl, 'Enter a full link, starting with https://'),
      }),
    )
    .max(maxLinks, `Add at most ${maxLinks} links`),
  roleInterests: z.array(z.string().trim().min(1).max(roleInterestMaxLength)).max(maxRoleInterests),
})

export type ActorProfileValues = z.infer<typeof actorProfileSchema>