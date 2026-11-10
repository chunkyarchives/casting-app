import { lazy, Suspense } from 'react'
import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'

const ChatNotifications = lazy(() => import('./ChatNotification'))

export function ChatNotifier() {
  const participant = useCurrentParticipant()
  if (!participant?.profileComplete) return null
  if (participant.role !== 'Actor' && participant.role !== 'Director') return null

  return (
    <Suspense fallback={null}>
      <ChatNotifications viewer={participant} />
    </Suspense>
  )
}