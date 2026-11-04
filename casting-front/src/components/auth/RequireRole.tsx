import { Navigate, Outlet } from 'react-router'
import { PageLoader } from '@/components/common/states/PageLoader'
import { paths, roleHomePath } from '@/lib/routes'
import type { ParticipantRole } from '@/types/participant'
import { useSession } from './session/session-context'

type Props = {
  role: ParticipantRole
}

export function RequireRole({ role }: Props) {
  const { status, participant } = useSession()

  if (status === 'loading') return <PageLoader className="min-h-svh" />
  if (!participant) return <Navigate to={paths.landing} replace />
  if (participant.role !== role) return <Navigate to={roleHomePath(participant.role)} replace />

  return <Outlet />
}