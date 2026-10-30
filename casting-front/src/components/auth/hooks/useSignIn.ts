import type { SignInRequest } from '@/types/participant'
import { useSession } from '../session/session-context'
import { useGoToRoleHome } from './useGoToRoleHome'

export function useSignIn() {
  const { signIn } = useSession()
  const goToRoleHome = useGoToRoleHome()

  return async (request: SignInRequest) => {
    const participant = await signIn(request)
    goToRoleHome(participant.role)
  }
}