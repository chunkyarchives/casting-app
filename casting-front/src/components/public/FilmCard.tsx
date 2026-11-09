import { FilmPoster } from '@/components/common/media/FilmPoster'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { PublicFilm } from '@/types/public'

const openRolesLabel = (count: number) => {
  if (count === 0) return 'No open roles'
  return count === 1 ? '1 open role' : `${count} open roles`
}

export function FilmCard({ film }: { film: PublicFilm }) {
  const details = [film.directorName, film.releaseYear, film.contentRating].filter(Boolean).join(' · ')

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      <FilmPoster posterUrl={film.posterUrl} className="w-full" />

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 className="truncate font-bold">{film.title}</h2>
          <p className="truncate text-xs text-muted-foreground">{details}</p>
        </div>
        <p className={cn('line-clamp-3 text-sm', !film.description && 'text-muted-foreground')}>
          {film.description ?? 'No description yet.'}
        </p>
        <Badge variant={film.openRoles > 0 ? 'default' : 'outline'} className="mt-auto">
          {openRolesLabel(film.openRoles)}
        </Badge>
      </div>
    </article>
  )
}