import type { ReactNode } from 'react'
import { StatusDot } from '@/components/common/display/StatusDot'
import { FilmPoster } from '@/components/common/media/FilmPoster'
import { ImageZoom } from '@/components/common/media/ImageZoom'
import { mediaUrl } from '@/lib/api/media'
import { formatCount, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Film } from '@/types/film'

type Props = {
  film: Film
  posterAction?: ReactNode
  aside?: ReactNode
}

const posterClass = 'w-full overflow-hidden rounded-xl shadow-lg ring-1 ring-border'

export function FilmHeader({ film, posterAction, aside }: Props) {
  const openRoles = film.roles.filter((role) => role.status === 'Open').length
  const facts = [
    {
      label: 'Status',
      value: <StatusDot tone={film.status === 'Active' ? 'positive' : 'neutral'}>{film.status}</StatusDot>,
    },
    { label: 'Release year', value: film.releaseYear ?? '-' },
    { label: 'Content rating', value: film.contentRating ?? '-' },
    { label: 'Roles', value: formatCount(film.roles.length) },
    { label: 'Open roles', value: formatCount(openRoles) },
    { label: 'Created', value: formatDate(film.createdAt) },
  ]

  return (
    <section className="grid gap-8 md:grid-cols-[13rem_minmax(0,1fr)_auto]">
      {aside && <div className="order-first md:order-last">{aside}</div>}

      <div className="relative w-40 self-start md:w-full">
        {film.posterUrl ? (
          <ImageZoom
            src={mediaUrl(film.posterUrl)}
            alt={`Poster of ${film.title}`}
            label={`Show the poster of ${film.title}`}
            className={posterClass}
          >
            <FilmPoster posterUrl={film.posterUrl} className="w-full" />
          </ImageZoom>
        ) : (
          <FilmPoster posterUrl={null} className={posterClass} />
        )}
        {posterAction && <div className="absolute top-2 right-2">{posterAction}</div>}
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        <h1 className="text-4xl font-bold text-balance wrap-break-word">{film.title}</h1>

        <dl className="flex flex-wrap gap-x-10 gap-y-4 border-y py-4">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1">
              <dt className="text-xs text-muted-foreground">{fact.label}</dt>
              <dd className="font-semibold tabular-nums">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <p className={cn('leading-relaxed whitespace-pre-line', !film.description && 'text-muted-foreground')}>
          {film.description ?? 'No description yet.'}
        </p>
      </div>
    </section>
  )
}