import { apiErrorMessage } from '@/lib/api/errors'
import { ApiError } from '@/lib/api/http'

export const crewErrorMessage = (error: unknown) =>
  error instanceof ApiError && error.status !== 429 && error.detail ? error.detail : apiErrorMessage(error)

export const joinErrorMessage = (error: unknown) => {
  if (error instanceof ApiError && error.status === 404) return 'No crew has this code.'
  if (error instanceof ApiError && error.status === 409) return 'You are already in this crew.'
  return crewErrorMessage(error)
}