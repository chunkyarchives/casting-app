import { directorsApi } from '@/lib/api/directors'
import type { CurrentParticipant } from '@/types/participant'
import { ProfileLoader } from '../form/ProfileLoader'
import { DirectorProfileForm } from './DirectorProfileForm'

export function DirectorAccount({ participant }: { participant: CurrentParticipant }) {
  return (
    <ProfileLoader cacheKey={`director:${participant.id}`} load={() => directorsApi.get(participant.id)}>
      {(director, reload) => <DirectorProfileForm participant={participant} director={director} onSaved={reload} />}
    </ProfileLoader>
  )
}