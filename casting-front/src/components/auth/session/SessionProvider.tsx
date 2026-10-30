import { useEffect, useState, type ReactNode } from 'react'
import { authApi } from '@/lib/api/auth'
import type { CurrentParticipant, SignInRequest, SignUpRequest } from '@/types/participant'
import { SessionContext, type SessionStatus } from './session-context'

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>('loading')
  const [participant, setParticipant] = useState<CurrentParticipant | null>(null)

  useEffect(() => {
    let ignore = false

    authApi
      .getMe()
      .then((me) => {
        if (!ignore) setParticipant(me)
      })
      .catch(() => {
      })
      .finally(() => {
        if (!ignore) setStatus('ready')
      })

    return () => {
      ignore = true
    }
  }, [])

  const signIn = async (request: SignInRequest) => {
    const me = await authApi.signIn(request)
    setParticipant(me)
    return me
  }

  const signUp = async (request: SignUpRequest) => {
    const me = await authApi.signUp(request)
    setParticipant(me)
    return me
  }

  const signOut = async () => {
    try {
      await authApi.signOut()
    } catch {
      // Clear the local session even when the server can't be reached
    }
    setParticipant(null)
  }

  return (
    <SessionContext value={{ status, participant, signIn, signUp, signOut }}>
      {children}
    </SessionContext>
  )
}