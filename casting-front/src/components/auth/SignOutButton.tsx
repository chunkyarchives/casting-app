import { Logout01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSignOut } from './useSignOut'

type Props = {
  compact?: boolean
}

export function SignOutButton({ compact = false }: Props) {
  const { pending, signOut } = useSignOut()
  const label = pending ? 'Signing out…' : 'Sign out'

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={<Button variant="outline" size="icon-sm" aria-label={label} disabled={pending} onClick={signOut} />}
        >
          <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Button variant="outline" disabled={pending} onClick={signOut}>
      {label}
    </Button>
  )
}