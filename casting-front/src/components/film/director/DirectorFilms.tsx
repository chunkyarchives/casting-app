import { AddTile } from '@/components/common/actions/AddTile'
import { LoadError } from '@/components/common/states/LoadError'
import { PosterTile } from '@/components/film/director/PosterTile'
import { useMyFilms } from '@/components/film/hooks/useFilms'
import { Skeleton } from '@/components/ui/skeleton'
import { filmPaths } from '@/lib/routes'

const skeletonCount = 6
const posterGrid = 'grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] sm:gap-x-6 sm:gap-y-8'

export function DirectorFilms() {
  const films = useMyFilms()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pt-2 pb-16">
      <h1 className="text-4xl font-bold">Films</h1>

      {films.status === 'loading' && (
        <div aria-busy className={posterGrid}>
          {Array.from({ length: skeletonCount }, (_, index) => (
            <Skeleton key={index} className="aspect-2/3 rounded-xl" />
          ))}
        </div>
      )}

      {films.status === 'error' && (
        <LoadError title="Your films could not be loaded" error={films.error} onRetry={films.reload} />
      )}

      {films.status === 'success' && (
        <ul className={posterGrid}>
          {films.data.map((film) => (
            <li key={film.id}>
              <PosterTile film={film} />
            </li>
          ))}
          <li>
            <AddTile to={filmPaths.create} label="Add a film" shape="poster" />
          </li>
        </ul>
      )}
    </div>
  )
}