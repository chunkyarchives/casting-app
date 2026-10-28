import { ApiError } from '@/lib/api/http'

export function authErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return 'Something went wrong. Try again.'

  switch (error.status) {
    case 0:
      return "Can't reach the server. Check your connection and try again."
    case 401:
      return error.detail ?? 'Wrong e-mail or password.'
    case 429:
      return error.retryAfterSeconds
        ? `Too many attempts. Try again in ${error.retryAfterSeconds} s.`
        : 'Too many attempts. Try again in a minute.'
    default:
      return error.detail ?? error.title
  }
}

type SignUpErrorField = 'fullName' | 'email' | 'password' | 'role' | 'root.server'

export type SignUpError = {
  field: SignUpErrorField
  message: string
}

const signUpFieldsByBackendName: Record<string, SignUpErrorField> = {
  email: 'email',
  password: 'password',
  firstname: 'fullName',
  lastname: 'fullName',
  role: 'role',
}

export function signUpErrors(error: unknown): SignUpError[] {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return [{ field: 'email', message: error.detail ?? 'This e-mail is already registered.' }]
    }

    const fieldErrors = Object.entries(error.fieldErrors).flatMap(([name, messages]) => {
      const field = signUpFieldsByBackendName[name.toLowerCase()]
      return field && messages.length > 0 ? [{ field, message: messages[0] }] : []
    })
    if (fieldErrors.length > 0) return fieldErrors
  }

  return [{ field: 'root.server', message: authErrorMessage(error) }]
}