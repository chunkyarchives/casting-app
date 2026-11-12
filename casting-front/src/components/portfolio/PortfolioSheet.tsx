import { LoadError } from '@/components/common/states/LoadError'
import { usePhotos, useShowreels } from '@/components/portfolio/hooks/usePortfolioMedia'
import { PhotoCarousel } from '@/components/portfolio/media/PhotoCarousel'
import { ShowreelTile } from '@/components/portfolio/media/ShowreelTile'
import { photoGroups } from '@/components/portfolio/portfolio-kinds'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'

type Props = {
  actorId: string
  name: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PortfolioSheet({ actorId, name, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription>Pictures and showreels</SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto p-4">
          {open && <PortfolioCarousels actorId={actorId} name={name} />}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function PortfolioCarousels({ actorId, name }: { actorId: string; name: string }) {
  const photos = usePhotos(actorId)
  const showreels = useShowreels(actorId)

  return (
    <>
      {photoGroups.map((group) => {
        const items = photos.status === 'success' ? photos.data.filter((photo) => photo.kind === group.kind) : []

        return (
          <section key={group.kind} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold">{group.title}</h3>
            {photos.status === 'loading' && <Skeleton className="aspect-square rounded-2xl" />}
            {photos.status === 'error' && (
              <LoadError title="Pictures could not be loaded" error={photos.error} onRetry={photos.reload} />
            )}
            {photos.status === 'success' && items.length === 0 && (
              <p className="text-sm text-muted-foreground">No {group.title.toLowerCase()} yet.</p>
            )}
            {items.length > 0 && <PhotoCarousel items={items} label={`${group.title} of ${name}`} />}
          </section>
        )
      })}

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Showreels</h3>
        {showreels.status === 'loading' && <Skeleton className="aspect-video rounded-2xl" />}
        {showreels.status === 'error' && (
          <LoadError title="Showreels could not be loaded" error={showreels.error} onRetry={showreels.reload} />
        )}
        {showreels.status === 'success' && showreels.data.length === 0 && (
          <p className="text-sm text-muted-foreground">No showreels yet.</p>
        )}
        {showreels.status === 'success' && showreels.data.length > 0 && (
          <ul className="flex flex-col gap-3">
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