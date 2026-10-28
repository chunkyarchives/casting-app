import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useSession } from './session/session-context'

export function SignOutButton() {
  const { signOut } = useSession()
  const [pending, setPending] = useState(false)

  const handleClick = () => {
    setPending(true)
    void signOut()
  }

  return (
    <Button variant="outline" disabled={pending} onClick={handleClick}>
      {pending ? 'Signing out…' : 'Sign out'}
    </Button>
  )
}