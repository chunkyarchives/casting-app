import { Link } from 'react-router'
import { FilmPoster } from '@/components/common/media/FilmPoster'
import { filmPaths } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { FilmSummary } from '@/types/film'

export function PosterTile({ film }: { film: FilmSummary }) {
  const archived = film.status === 'Archived'
  const details = [film.releaseYear, film.contentRating].filter(Boolean).join(' · ')

  return (
    <div className="flex flex-col gap-2">
      <Link
        to={filmPaths.film(film.id)}
        className="group/poster relative block overflow-hidden rounded-xl shadow-md ring-1 ring-border transition-[translate,box-shadow] duration-200 outline-none hover:-translate-y-1 hover:shadow-xl hover:ring-primary/60 focus-visible:-translate-y-1 focus-visible:ring-[3px] focus-visible:ring-ring/60 motion-reduce:transition-none"
      >
        <FilmPoster posterUrl={film.posterUrl} className={cn('w-full', archived && 'opacity-50 grayscale')} />
        <span className="absolute inset-x-0 bottom-0 flex translate-y-2 flex-col gap-0.5 bg-linear-to-t from-black/90 via-black/60 to-transparent px-3 pt-10 pb-3 text-white opacity-0 transition duration-200 group-hover/poster:translate-y-0 group-hover/poster:opacity-100 group-focus-visible/poster:translate-y-0 group-focus-visible/poster:opacity-100">
          <span className="line-clamp-2 text-sm font-bold">{film.title}</span>
          {details && <span className="text-xs text-white/70">{details}</span>}
        </span>
      </Link>

      {film.roleCount === 0 && !archived && (
        <span className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        {archived && <span className="text-center text-xs text-muted-foreground">Archived</span>}
          Needs roles
        </span>
      )}
      {archived && <span className="text-xs text-muted-foreground">Archived</span>}
    </div>
  )
}