import { useSession } from './session/session-context'

export function useCurrentParticipant() {
  return useSession().participant
}