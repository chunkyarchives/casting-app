import { Navigate, Outlet } from 'react-router'
import { roleSettingsPath } from '@/lib/routes'
import { useCurrentParticipant } from './useCurrentParticipant'

export function RequireCompleteProfile() {
  const participant = useCurrentParticipant()

  if (participant && !participant.profileComplete) {
    return <Navigate to={roleSettingsPath(participant.role)} replace />
  }

  return <Outlet />
}