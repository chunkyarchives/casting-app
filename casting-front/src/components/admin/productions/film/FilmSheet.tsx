import { Delete02Icon, MaskTheater01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { ProductionAction } from '@/components/admin/productions/production-actions'
import { DetailGroup, DetailGroupsSkeleton, DetailRow } from '@/components/common/display/DetailList'
import { FilmPoster } from '@/components/common/media/FilmPoster'
import { ImageZoom } from '@/components/common/media/ImageZoom'
import { StatusDot } from '@/components/common/display/StatusDot'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { LoadError } from '@/components/common/states/LoadError'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery'
import { adminApi } from '@/lib/api/admin'
import { mediaUrl } from '@/lib/api/media'
import { formatCount, formatDateTime } from '@/lib/format'
import type { AdminFilm, AdminFilmDetail } from '@/types/admin'
import { FilmRoleCard } from './FilmRoleCard'

const maxRoleSkeletons = 2

type Props = {
  film: AdminFilm | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAction: (action: ProductionAction) => void
}

export function FilmSheet({ film, open, onOpenChange, onAction }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto data-[side=right]:sm:max-w-lg">
        {film && <FilmDetails key={film.id} film={film} onAction={onAction} />}
      </SheetContent>
    </Sheet>
  )
}

type FilmDetailsProps = Pick<Props, 'onAction'> & {
  film: AdminFilm
}

function FilmDetails({ film, onAction }: FilmDetailsProps) {
  const details = useApiQuery(`admin-film-${film.id}`, () => adminApi.getFilm(film.id))

  return (
    <>
      <SheetHeader className="flex-row items-center gap-4 pr-12">
        {film.posterUrl ? (
          <ImageZoom
            src={mediaUrl(film.posterUrl)}
            alt={`Poster of ${film.title}`}
            label={`Show the poster of ${film.title}`}
            className="w-14"
          >
            <FilmPoster posterUrl={film.posterUrl} className="w-full" />
          </ImageZoom>
        ) : (
          <FilmPoster posterUrl={null} className="w-14 shrink-0" />
        )}
        <div className="flex min-w-0 flex-col gap-0.5">
          <SheetTitle>{film.title}</SheetTitle>
          <SheetDescription>Directed by {film.directorName}</SheetDescription>
        </div>
      </SheetHeader>

      {details.status === 'loading' && <FilmDetailsSkeleton roleCount={film.roleCount} />}
      {details.status === 'error' && (
          <LoadError title="Film could not be loaded" error={details.error} onRetry={details.reload} className="p-6" />
      )}
      {details.status === 'success' && (
        <>
          <FilmDetailGroups details={details.data} />
          <SheetFooter>
            <Button variant="destructive" onClick={() => onAction({ kind: 'deleteFilm', film })}>
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
              Delete film
            </Button>
          </SheetFooter>
        </>
      )}
    </>
  )
}

function FilmDetailGroups({ details: { film, applications } }: { details: AdminFilmDetail }) {
  const applicationsByRole = new Map(applications.map((counts) => [counts.roleId, counts]))

  return (
    <div className="flex flex-col gap-6 px-6 pb-6">
      <DetailGroup title="Film">
        <DetailRow label="Status">
          <StatusDot tone={film.status === 'Active' ? 'positive' : 'neutral'}>{film.status}</StatusDot>
        </DetailRow>
        <DetailRow label="Release year">{film.releaseYear ?? '-'}</DetailRow>
        <DetailRow label="Content rating">{film.contentRating ?? '-'}</DetailRow>
        <DetailRow label="Created">{formatDateTime(film.createdAt)}</DetailRow>
        {film.description && (
          <DetailRow label="Description:" stacked>
            {film.description}
          </DetailRow>
        )}
      </DetailGroup>

      <Separator />

      <section className="flex flex-col gap-3 text-sm">
        <h3 className="font-medium">
          Roles <span className="text-muted-foreground tabular-nums">{formatCount(film.roles.length)}</span>
        </h3>

        {film.roles.length === 0 ? (
          <EmptyMessage icon={MaskTheater01Icon} title="No roles yet" className="p-6" />
        ) : (
          film.roles.map((role) => (
            <FilmRoleCard key={role.id} role={role} applications={applicationsByRole.get(role.id)} />
          ))
        )}
      </section>
    </div>
  )
}

function FilmDetailsSkeleton({ roleCount }: { roleCount: number }) {
  return (
    <div className="flex flex-col gap-6 px-6 pb-6" aria-busy>
      <DetailGroupsSkeleton rowCounts={[4]} />
      <Separator />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-20" />
        {Array.from({ length: Math.min(roleCount, maxRoleSkeletons) }, (_, index) => (
          <Skeleton key={index} className="h-64 w-full rounded-4xl" />
        ))}
      </div>
    </div>
  )
}