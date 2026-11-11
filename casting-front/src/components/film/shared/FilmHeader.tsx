import { useId, type ReactNode } from 'react'
import { SectionTitle } from '@/components/common/display/SectionTitle'
import { StatusDot } from '@/components/common/display/StatusDot'
import { FilmPoster } from '@/components/common/media/FilmPoster'
import { ImageZoom } from '@/components/common/media/ImageZoom'
import { mediaUrl } from '@/lib/api/media'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Film } from '@/types/film'

type Props = {
  film: Film
  posterAction?: ReactNode
  aside?: ReactNode
}

const posterClass = 'w-full overflow-hidden rounded-xl shadow-lg ring-1 ring-border'

export function FilmHeader({ film, posterAction, aside }: Props) {
  const detailsId = useId()
  const facts = [
    {
      label: 'Status',
      value: <StatusDot tone={film.status === 'Active' ? 'positive' : 'neutral'}>{film.status}</StatusDot>,
    },
    { label: 'Release year', value: film.releaseYear ?? '-' },
    { label: 'Content rating', value: film.contentRating ?? '-' },
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
        {posterAction && <div className="absolute top-2 right-2 flex gap-1">{posterAction}</div>}
      </div>

      <div className="flex min-w-0 flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-balance wrap-break-word">{film.title}</h1>
          <p className={cn('max-w-prose leading-relaxed whitespace-pre-line', !film.description && 'text-muted-foreground')}>
            {film.description ?? 'No description yet.'}
          </p>
        </div>

        <section aria-labelledby={detailsId} className="flex max-w-lg flex-col">
          <SectionTitle id={detailsId}>Film details</SectionTitle>

          <dl className="grid grid-cols-[8.5rem_minmax(0,1fr)] gap-x-6 gap-y-3 py-4 text-sm">
            {facts.map((fact) => (
              <div key={fact.label} className="contents">
                <dt className="text-muted-foreground">{fact.label}</dt>
                <dd className="tabular-nums">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </section>
  )
}