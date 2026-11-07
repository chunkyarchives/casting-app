import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'
import { LoadError } from '@/components/common/states/LoadError'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery'
import { actorsApi } from '@/lib/api/actors'
import { ActorProfileForm } from './ActorProfileForm'

export function ActorAccount() {
  const participant = useCurrentParticipant()
  const participantId = participant?.id ?? ''
  const actor = useApiQuery(`actor:${participantId}`, () => actorsApi.get(participantId))

  if (!participant) return null
  if (actor.status === 'loading') return <Skeleton className="h-52 rounded-xl" />
  if (actor.status === 'error') {
    return <LoadError title="Your profile could not be loaded" error={actor.error} onRetry={actor.reload} />
  }

  return <ActorProfileForm participant={participant} actor={actor.data} onSaved={actor.reload} />
}