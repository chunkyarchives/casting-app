import { lazy, Suspense } from 'react'
import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'

const ApplicationNotifications = lazy(() => import('@/components/application/notifications/ApplicationNotifications'))

export function ApplicationNotifier() {
  const participant = useCurrentParticipant()
  if (!participant?.profileComplete || participant.role !== 'Director') return null

  return (
    <Suspense fallback={null}>
      <ApplicationNotifications />
    </Suspense>
  )
}