import { Logout01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useSignOut } from './hooks/useSignOut'

const sidebarColors =
  'border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:bg-transparent dark:hover:bg-sidebar-accent'
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
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={label}
              disabled={pending}
              onClick={signOut}
              className={sidebarColors}
            />
          }
        >
          <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Button variant="outline" disabled={pending} onClick={signOut} className={sidebarColors}>
      {label}
    </Button>
  )
}