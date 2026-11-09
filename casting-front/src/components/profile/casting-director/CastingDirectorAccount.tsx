import { castingDirectorsApi } from '@/lib/api/casting-directors'
import type { CurrentParticipant } from '@/types/participant'
import { ProfileLoader } from '../form/ProfileLoader'
import { CastingDirectorProfileForm } from './CastingDirectorProfileForm'

export function CastingDirectorAccount({ participant }: { participant: CurrentParticipant }) {
  return (
    <ProfileLoader
      cacheKey={`casting-director:${participant.id}`}
      load={() => castingDirectorsApi.get(participant.id)}
    >
      {(castingDirector, reload) => (
        <CastingDirectorProfileForm participant={participant} castingDirector={castingDirector} onSaved={reload} />
      )}
    </ProfileLoader>
  )
}