import { useMatch, useNavigate } from 'react-router'
import { useCurrentParticipant } from '@/components/auth/useCurrentParticipant'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { roleSettingsPath } from '@/lib/routes'

type Props = {
  className?: string
}

export function CompleteProfileNotice({ className }: Props) {
  const participant = useCurrentParticipant()
  const navigate = useNavigate()
  const settingsPath = participant ? roleSettingsPath(participant.role) : ''

  const inSettings = useMatch({ path: settingsPath, end: false }) !== null

  if (!participant || participant.profileComplete || inSettings) return null

  return (
    <Alert className={className}>
      <AlertTitle>Complete your profile</AlertTitle>
      <AlertDescription>Some features stay locked until your profile is complete.</AlertDescription>
      <AlertAction>
        <Button
          size="xs"
          className="bg-foreground text-background hover:bg-foreground/90"
          onClick={() => navigate(settingsPath)}
        >
          Settings
        </Button>
      </AlertAction>
    </Alert>
  )
}