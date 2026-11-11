import { FilmPoster } from '@/components/common/media/FilmPoster'
import { LoadError } from '@/components/common/states/LoadError'
import { PageLoader } from '@/components/common/states/PageLoader'
import { useApiQuery } from '@/hooks/useApiQuery'
import { directorsApi } from '@/lib/api/directors'
import { filmsApi } from '@/lib/api/films'
import { cn } from '@/lib/utils'
import type { Director } from '@/types/director'
import type { FilmSummary } from '@/types/film'
import { ProfileBasics } from './ProfileBasics'
import { ProfileSheet } from './ProfileSheet'

type Props = {
  directorId: string
  name: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DirectorInfoSheet({ directorId, name, open, onOpenChange }: Props) {
  return (
    <ProfileSheet name={name} description="Profile and films" open={open} onOpenChange={onOpenChange}>
      <DirectorInfo directorId={directorId} name={name} />
    </ProfileSheet>
  )
}

function DirectorInfo({ directorId, name }: { directorId: string; name: string }) {
  const director = useApiQuery(`chat-director-${directorId}`, () => directorsApi.get(directorId))
  const films = useApiQuery(`chat-director-films-${directorId}`, () => filmsApi.byDirector(directorId))

  return (
    <>
      {director.status === 'loading' && <PageLoader />}
      {director.status === 'error' && (
        <LoadError title="The profile could not be loaded" error={director.error} onRetry={director.reload} />
      )}
      {director.status === 'success' && <DirectorProfile director={director.data} name={name} />}

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Films</h3>
        {films.status === 'loading' && <PageLoader className="p-4" />}
        {films.status === 'error' && <LoadError title="Films could not be loaded" error={films.error} onRetry={films.reload} />}
        {films.status === 'success' && films.data.length === 0 && (
          <p className="text-sm text-muted-foreground">{name} has no films yet.</p>
        )}
        {films.status === 'success' && films.data.length > 0 && (
          <ul className="grid grid-cols-3 gap-x-3 gap-y-4">
            {films.data.map((film) => (
              <li key={film.id}>
                <FilmTile film={film} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

function DirectorProfile({ director, name }: { director: Director; name: string }) {
  const facts = [director.age !== null ? `${director.age} years` : null, director.gender]

  return (
    <ProfileBasics participantId={director.id} name={name} facts={facts} origin={director.origin}>
      {director.bio && <p className="text-left text-sm whitespace-pre-line">{director.bio}</p>}
    </ProfileBasics>
  )
}

function FilmTile({ film }: { film: FilmSummary }) {
  const archived = film.status === 'Archived'

  return (
    <figure className={cn('flex flex-col gap-1.5', archived && 'opacity-70 grayscale')}>
      <FilmPoster posterUrl={film.posterUrl} className="w-full overflow-hidden rounded-xl shadow-sm ring-1 ring-border" />
      <figcaption className="flex flex-col items-center text-center">
        <span className="line-clamp-2 text-xs font-medium">{film.title}</span>
        {archived && <span className="text-xs text-muted-foreground">Archived</span>}
      </figcaption>
    </figure>
  )
}