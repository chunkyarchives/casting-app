import { lazy, Suspense } from 'react'
import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'

const ApplicationNotifications = lazy(() => import('@/components/application/notifications/ApplicationNotifications'))
const DecisionNotifications = lazy(() => import('@/components/application/notifications/DecisionNotifications'))
const ProposalNotifications = lazy(() => import('@/components/application/notifications/ProposalNotifications'))

export function ApplicationNotifier() {
  const participant = useCurrentParticipant()
  if (!participant?.profileComplete) return null

  return (
    <Suspense fallback={null}>
      {participant.role === 'Director' && <ApplicationNotifications />}
      {participant.role === 'Actor' && <DecisionNotifications />}
      {participant.role === 'CastingDirector' && <ProposalNotifications />}
    </Suspense>
  )
}