import { createContext, useContext } from 'react'
import type { CurrentParticipant, SignInRequest } from '@/types/participant'

export type SessionStatus = 'loading' | 'ready'

type SessionContextValue = {
  status: SessionStatus
  participant: CurrentParticipant | null
  signIn: (request: SignInRequest) => Promise<CurrentParticipant>
  signOut: () => Promise<void>
}

export const SessionContext = createContext<SessionContextValue | null>(null)

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>')
  return ctx
}