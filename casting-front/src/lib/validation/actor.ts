import * as z from 'zod'
import { bioField, originField, personFields } from './profile'

export const heightRange = { min: 50, max: 260 }
export const weightRange = { min: 20, max: 500 }
export const maxLinks = 10
export const maxRoleInterests = 20
export const roleInterestMaxLength = 50

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const measurement = (range: { min: number; max: number }, what: string, unit: string) =>
  z
    .number()
    .int('Enter a whole number')
    .min(range.min, `Enter a ${what} between ${range.min} and ${range.max} ${unit}`)
    .max(range.max, `Enter a ${what} between ${range.min} and ${range.max} ${unit}`)
    .nullable()

export const actorProfileSchema = z.object({
  ...personFields,
  origin: originField,
  bio: bioField,
  height: measurement(heightRange, 'height', 'cm'),
  weight: measurement(weightRange, 'weight', 'kg'),
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