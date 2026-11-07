import { useState } from 'react'
import { useSession } from '../session/session-context'

export function useSignOut() {
  const { signOut } = useSession()
  const [pending, setPending] = useState(false)

  const start = () => {
    setPending(true)
    void signOut()
  }

  return { pending, signOut: start }
}