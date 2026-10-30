import { ApiError } from '@/lib/api/http'
import { apiErrorMessage } from '@/lib/api/errors'

export function authErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 401) {
    return error.detail ?? 'Wrong e-mail or password.'
  }
  return apiErrorMessage(error)
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