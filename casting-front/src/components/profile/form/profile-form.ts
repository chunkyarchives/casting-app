import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { authApi } from '@/lib/api/auth'
import { ApiError } from '@/lib/api/http'
import { isCountryCode } from '@/lib/countries'
import { genders } from '@/lib/validation/profile'

export type ProfileName = {
  firstName: string
  lastName: string
}

const nameFields: string[] = ['firstName', 'lastName']

export const knownGender = (gender: string | null) =>
  genders.find((option) => option.toLowerCase() === gender?.toLowerCase()) ?? null

export const knownOrigin = (origin: string | null) =>
  origin && isCountryCode(origin) ? origin.toUpperCase() : null

export const optionalText = (text: string) => text.trim() || null

export async function saveProfile<TProfile>(
  name: ProfileName,
  dirty: object,
  current: TProfile,
  update: () => Promise<TProfile>,
) {
  const changed = Object.keys(dirty)
  const profile = changed.some((field) => !nameFields.includes(field)) ? await update() : current

  if (changed.some((field) => nameFields.includes(field))) {
    await authApi.updateName({ firstName: name.firstName, lastName: name.lastName })
  }

  return profile
}

const toFieldPath = (serverKey: string) =>
  serverKey
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .map((part) => part.charAt(0).toLowerCase() + part.slice(1))
    .join('.')

export function showServerErrors<TValues extends FieldValues>(error: unknown, setError: UseFormSetError<TValues>) {
  if (!(error instanceof ApiError) || error.status !== 400) return false

  const entries = Object.entries(error.fieldErrors)
  entries.forEach(([key, messages]) => setError(toFieldPath(key) as Path<TValues>, { message: messages[0] }))
  return entries.length > 0
}