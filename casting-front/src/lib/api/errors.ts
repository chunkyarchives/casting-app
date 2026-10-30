import { ApiError } from './http'

export function apiErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Something went wrong. Try again.'

  switch (error.status) {
    case 0:
      return "Can't reach the server. Check your connection and try again."
    case 403:
      return "You don't have permission to do this."
    case 429:
      return error.retryAfterSeconds
        ? `Too many requests. Try again in ${error.retryAfterSeconds} s.`
        : 'Too many requests. Try again in a minute.'
    default:
      return error.detail ?? error.title
  }
}