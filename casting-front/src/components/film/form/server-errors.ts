import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from '@/lib/api/http'

const toFieldPath = (serverKey: string) => serverKey.charAt(0).toLowerCase() + serverKey.slice(1)

export function showServerErrors<TValues extends FieldValues>(error: unknown, setError: UseFormSetError<TValues>) {
  if (!(error instanceof ApiError) || error.status !== 400) return false

  const entries = Object.entries(error.fieldErrors)
  entries.forEach(([key, messages]) => setError(toFieldPath(key) as Path<TValues>, { message: messages[0] }))
  return entries.length > 0
}

export const optionalText = (text: string) => text.trim() || null