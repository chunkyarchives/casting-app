import { useNavigate } from 'react-router'
import { ApiError } from '@/lib/api/http'
import { roleHomePath } from '@/lib/routes'
import type { SignInRequest } from '@/types/participant'
import { useSession } from './session/session-context'

export function useSignIn() {
  const { signIn } = useSession()
  const navigate = useNavigate()

  return async (request: SignInRequest) => {
    const participant = await signIn(request)
    navigate(roleHomePath(participant.role))
  }
}

export function signInErrorMessage(error: unknown): string {
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