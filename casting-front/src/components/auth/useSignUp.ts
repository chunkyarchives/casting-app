import type { SignUpRequest } from '@/types/participant'
import { useSession } from './session/session-context'
import { useGoToRoleHome } from './useGoToRoleHome'

export function useSignUp() {
  const { signUp } = useSession()
  const goToRoleHome = useGoToRoleHome()

  return async (request: SignUpRequest) => {
    const participant = await signUp(request)
    goToRoleHome(participant.role)
  }
}