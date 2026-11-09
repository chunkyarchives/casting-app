import { actorsApi } from '@/lib/api/actors'
import type { CurrentParticipant } from '@/types/participant'
import { ProfileLoader } from '../form/ProfileLoader'
import { ActorProfileForm } from './ActorProfileForm'

export function ActorAccount({ participant }: { participant: CurrentParticipant }) {
  return (
    <ProfileLoader cacheKey={`actor:${participant.id}`} load={() => actorsApi.get(participant.id)}>
      {(actor, reload) => <ActorProfileForm participant={participant} actor={actor} onSaved={reload} />}
    </ProfileLoader>
  )
}