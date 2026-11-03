import { Film01Icon } from '@hugeicons/core-free-icons'
import type { ProductionRow } from '@/components/admin/productions/production-rows'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { FilmPoster } from '@/components/common/media/FilmPoster'
import { LoadError } from '@/components/common/states/LoadError'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery'
import { adminApi } from '@/lib/api/admin'
import { formatCount } from '@/lib/format'
import type { AdminFilm } from '@/types/admin'

const maxSkeletons = 6

type Props = {
  row: ProductionRow
  revision: number
  onOpenFilm: (film: AdminFilm) => void
}

export function CrewFilmsPanel({ row, revision, onOpenFilm }: Props) {
  return (
    <div className="border-b bg-muted/30 p-4">
      {row.filmCount === 0 ? (
        <EmptyMessage icon={Film01Icon} title="No films yet" className="p-6" />
      ) : (
        <DirectorFilms row={row} revision={revision} onOpenFilm={onOpenFilm} />
      )}
    </div>
  )
}

function DirectorFilms({ row, revision, onOpenFilm }: Props) {
  const films = useApiQuery(
    `admin-director-films-${row.directorId}`,
    () => adminApi.getDirectorFilms(row.directorId),
    { refresh: revision },
  )

  if (films.status === 'loading') {
    return (
      <ul className="flex flex-wrap gap-4" aria-busy>
        {Array.from({ length: Math.min(row.filmCount, maxSkeletons) }, (_, index) => (
          <li key={index} className="flex w-28 flex-col gap-2">
            <Skeleton className="aspect-2/3 w-full rounded-none" />
            <div className="flex flex-col gap-0.5">
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </li>
        ))}
      </ul>
    )
  }

  if (films.status === 'error') {
    return <LoadError title="Films could not be loaded" error={films.error} onRetry={films.reload} className="p-6" />
  }

  return (
    <ul className="flex flex-wrap gap-4">
      {films.data.map((film) => (
        <li key={film.id}>
          <FilmCard film={film} onOpen={() => onOpenFilm(film)} />
        </li>
      ))}
    </ul>
  )
}

function FilmCard({ film, onOpen }: { film: AdminFilm; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-28 flex-col gap-2 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
    >
      <FilmPoster posterUrl={film.posterUrl} className="w-full ring-gray-300 transition-shadow duration-175 group-hover:ring-4" />
      <span className="flex flex-col gap-0.5">
        <span className="line-clamp-2 text-sm font-medium">{film.title}</span>
        <span className="text-xs text-muted-foreground">
          {formatCount(film.roleCount)} {film.roleCount === 1 ? 'role' : 'roles'}
          {film.status === 'Archived' && ' · Archived'}
        </span>
      </span>
    </button>
  )
}