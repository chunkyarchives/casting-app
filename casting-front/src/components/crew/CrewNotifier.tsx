import { lazy, Suspense } from 'react'
import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'

const CrewNotifications = lazy(() => import('@/components/crew/notifications/CrewNotifications'))

export function CrewNotifier() {
  const participant = useCurrentParticipant()
  if (!participant?.profileComplete) return null
  if (participant.role !== 'Director' && participant.role !== 'CastingDirector') return null

  return (
    <Suspense fallback={null}>
      <CrewNotifications viewer={participant} />
    </Suspense>
  )
}