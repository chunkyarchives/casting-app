import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'
import { SectionTitle } from '@/components/common/display/SectionTitle'
import { LoadError } from '@/components/common/states/LoadError'
import { PageLoader } from '@/components/common/states/PageLoader'
import { PhotoSection } from '@/components/portfolio/editor/PhotoSection'
import { ShowreelSection } from '@/components/portfolio/editor/ShowreelSection'
import { usePhotos, useShowreels } from '@/components/portfolio/hooks/usePortfolioMedia'
import { IdentityCard } from '@/components/portfolio/identity/IdentityCard'
import { photoGroups } from '@/components/portfolio/portfolio-kinds'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery'
import { actorsApi } from '@/lib/api/actors'
import { roleSettingsPath } from '@/lib/routes'
import type { MediaItem } from '@/types/media'
import type { CurrentParticipant } from '@/types/participant'

const replaceItem = (items: MediaItem[], item: MediaItem) => items.map((current) => (current.id === item.id ? item : current))
const withoutItem = (items: MediaItem[], itemId: string) => items.filter((current) => current.id !== itemId)

export function ActorPortfolio() {
  const participant = useCurrentParticipant()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pt-2 pb-16">
      <SectionTitle as="h1" size="page">
        Your portfolio
      </SectionTitle>
      {participant && <PortfolioContent participant={participant} />}
    </div>
  )
}

function PortfolioContent({ participant }: { participant: CurrentParticipant }) {
  const actor = useApiQuery(`actor:${participant.id}`, () => actorsApi.get(participant.id))
  const photos = usePhotos(participant.id)
  const showreels = useShowreels(participant.id)

  return (
    <>
      {actor.status === 'loading' && <Skeleton className="h-56 rounded-2xl" />}
      {actor.status === 'error' && <LoadError title="Your details could not be loaded" error={actor.error} onRetry={actor.reload} />}
      {actor.status === 'success' && (
        <IdentityCard
          actor={actor.data}
          email={participant.email}
          pictureUrl={participant.profilePictureUrl}
          editTo={roleSettingsPath(participant.role)}
        />
      )}

      {photos.status === 'loading' && <PageLoader />}
      {photos.status === 'error' && <LoadError title="Your pictures could not be loaded" error={photos.error} onRetry={photos.reload} />}
      {photos.status === 'success' &&
        photoGroups.map((group) => (
          <PhotoSection
            key={group.kind}
            group={group}
            photos={photos.data.filter((photo) => photo.kind === group.kind)}
            onAdded={(photo) => photos.setData([...photos.data, photo])}
            onChanged={(photo) => photos.setData(replaceItem(photos.data, photo))}
            onRemoved={(photoId) => photos.setData(withoutItem(photos.data, photoId))}
          />
        ))}

      {showreels.status === 'loading' && <PageLoader />}
      {showreels.status === 'error' && (
        <LoadError title="Your showreels could not be loaded" error={showreels.error} onRetry={showreels.reload} />
      )}
      {showreels.status === 'success' && (
        <ShowreelSection
          showreels={showreels.data}
          onAdded={(showreel) => showreels.setData([...showreels.data, showreel])}
          onChanged={(showreel) => showreels.setData(replaceItem(showreels.data, showreel))}
          onRemoved={(showreelId) => showreels.setData(withoutItem(showreels.data, showreelId))}
        />
      )}
    </>
  )
}