import { Link } from 'react-router'
import { useCurrentParticipant } from '@/components/auth/useCurrentParticipant'
import { buttonVariants } from '@/components/ui/button'
import { roleDescriptions, roleLabels } from '@/lib/roles'
import { roleSettingsPath } from '@/lib/routes'
import { themes } from '@/lib/themes'
import { cn } from '@/lib/utils'
import type { SignUpRole } from '@/types/participant'

type Props = {
  role: SignUpRole
}

export default function Welcome({ role }: Props) {
  const participant = useCurrentParticipant()
  const locked = !participant?.profileComplete

  return (
    <div
      className={cn(
        'mx-3 mb-3 flex flex-1 flex-col items-center justify-center gap-3 rounded-xl p-6 text-center',
        locked && `${themes.grayscale} bg-background text-foreground`,
      )}
    >
      <h1 className="text-4xl font-semibold tracking-tight">{roleLabels[role]}</h1>
      <p className="max-w-md text-muted-foreground">{roleDescriptions[role]}</p>

      {locked && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="max-w-md text-sm">Unlock all features by completing your profile in Settings → Account.</p>
          <Link to={roleSettingsPath(role)} className={buttonVariants()}>
            Complete profile
          </Link>
        </div>
      )}
    </div>
  )
}