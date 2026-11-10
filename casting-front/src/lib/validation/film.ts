import * as z from 'zod'
import type { MediaItem } from '@/types/media'
import { genders, originField } from './profile'

export const filmTitleMaxLength = 200
export const filmDescriptionMaxLength = 4000
export const roleNameMaxLength = 200
export const roleDescriptionMaxLength = 2000
export const conceptArtCaptionMaxLength = 140
export const maxConceptArt = 5

export const contentRatings = ['G', 'PG', 'PG-13', 'R', 'NC-17'] as const
export const filmStatuses = ['Active', 'Archived'] as const

export const releaseYearRange = { min: 1888, max: 2100 }
export const roleAgeRange = { min: 0, max: 120 }
export const roleHeightRange = { min: 0, max: 300 }
export const roleWeightRange = { min: 0, max: 500 }

export type PosterValue =
  | { kind: 'saved'; url: string }
  | { kind: 'new'; picture: Blob; preview: string }
  | { kind: 'none' }

export type ConceptArtValue =
  | { kind: 'saved'; media: MediaItem }
  | { kind: 'new'; id: string; picture: Blob; preview: string; caption: string }

const wholeNumber = (range: { min: number; max: number }, message: string) =>
  z.number().int(message).min(range.min, message).max(range.max, message).nullable()

export const filmSchema = z.object({
  title: z.string().trim().min(1, 'Give the film a title').max(filmTitleMaxLength, 'The title is too long'),
  description: z.string().max(filmDescriptionMaxLength, 'The description is too long'),
  releaseYear: wholeNumber(releaseYearRange, `Enter a year between ${releaseYearRange.min} and ${releaseYearRange.max}`),
  contentRating: z.string().max(20, 'The rating is too long').nullable(),
  status: z.enum(filmStatuses),
  poster: z.custom<PosterValue>(),
})

const ageMessage = `Enter an age between ${roleAgeRange.min} and ${roleAgeRange.max}`
const heightMessage = `Enter a height between ${roleHeightRange.min} and ${roleHeightRange.max} cm`
const weightMessage = `Enter a weight between ${roleWeightRange.min} and ${roleWeightRange.max} kg`

const rangeChecks = [
  { min: 'ageMin', max: 'ageMax', message: 'The lowest age is above the highest' },
  { min: 'heightMin', max: 'heightMax', message: 'The lowest height is above the highest' },
  { min: 'weightMin', max: 'weightMax', message: 'The lowest weight is above the highest' },
] as const

export const roleSchema = z
  .object({
    name: z.string().trim().min(1, 'Name the role').max(roleNameMaxLength, 'The name is too long'),
    description: z.string().max(roleDescriptionMaxLength, 'The description is too long'),
    ageMin: wholeNumber(roleAgeRange, ageMessage),
    ageMax: wholeNumber(roleAgeRange, ageMessage),
    heightMin: wholeNumber(roleHeightRange, heightMessage),
    heightMax: wholeNumber(roleHeightRange, heightMessage),
    weightMin: wholeNumber(roleWeightRange, weightMessage),
    weightMax: wholeNumber(roleWeightRange, weightMessage),
    gender: z.enum(genders).nullable(),
    origin: originField,
    conceptArt: z.array(z.custom<ConceptArtValue>()).max(maxConceptArt, `Use at most ${maxConceptArt} pictures`),
  })
  .superRefine((values, context) => {
    rangeChecks.forEach(({ min, max, message }) => {
      const low = values[min]
      const high = values[max]
      if (low !== null && high !== null && low > high) context.addIssue({ code: 'custom', path: [max], message })
    })
  })

export type FilmValues = z.infer<typeof filmSchema>
export type RoleValues = z.infer<typeof roleSchema>