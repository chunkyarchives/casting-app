import { LoadError } from '@/components/common/states/LoadError'
import { PageLoader } from '@/components/common/states/PageLoader'
import { usePhotos, useShowreels } from '@/components/portfolio/hooks/usePortfolioMedia'
import { PhotoTile } from '@/components/portfolio/media/PhotoTile'
import { ShowreelTile } from '@/components/portfolio/media/ShowreelTile'

type Props = {
  actorId: string
  name: string
}

export function PortfolioGallery({ actorId, name }: Props) {
  const photos = usePhotos(actorId)
  const showreels = useShowreels(actorId)

  return (
    <>
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Photos</h3>
        {photos.status === 'loading' && <PageLoader className="p-4" />}
        {photos.status === 'error' && <LoadError title="Photos could not be loaded" error={photos.error} onRetry={photos.reload} />}
        {photos.status === 'success' && photos.data.length === 0 && (
          <p className="text-sm text-muted-foreground">{name} has no photos yet.</p>
        )}
        {photos.status === 'success' && photos.data.length > 0 && (
          <ul className="grid grid-cols-3 gap-2">
            {photos.data.map((photo, position) => (
              <li key={photo.id}>
                <PhotoTile photo={photo} label={`photo ${position + 1} of ${name}`} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Showreels</h3>
        {showreels.status === 'loading' && <PageLoader className="p-4" />}
        {showreels.status === 'error' && (
          <LoadError title="Showreels could not be loaded" error={showreels.error} onRetry={showreels.reload} />
        )}
        {showreels.status === 'success' && showreels.data.length === 0 && (
          <p className="text-sm text-muted-foreground">{name} has no showreels yet.</p>
        )}
        {showreels.status === 'success' && showreels.data.length > 0 && (
          <ul className="grid grid-cols-2 gap-2">
            {showreels.data.map((showreel, position) => (
              <li key={showreel.id}>
                <ShowreelTile showreel={showreel} label={`showreel ${position + 1} of ${name}`} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}