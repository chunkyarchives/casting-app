import { PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from 'react-router'
import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'
import { LoadError } from '@/components/common/states/LoadError'
import { PageLoader } from '@/components/common/states/PageLoader'
import { AddTile } from '@/components/film/director/AddTitle'
import { BackButton } from '@/components/film/director/BackButton'
import { useFilm } from '@/components/film/hooks/useFilms'
import { FilmHeader } from '@/components/film/shared/FilmHeader'
import { RoleCard } from '@/components/film/shared/RoleCard'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatCount } from '@/lib/format'
import { filmPaths } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { Film } from '@/types/film'

export function DirectorFilm({ filmId }: { filmId: string }) {
  const film = useFilm(filmId)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pt-2 pb-32">
    {film.status !== 'success' && <BackButton to={filmPaths.library} label="Back to library" prominent />}

      {film.status === 'loading' && <PageLoader />}
      {film.status === 'error' && <LoadError title="This film could not be loaded" error={film.error} onRetry={film.reload} />}
      {film.status === 'success' && <FilmOverview film={film.data} />}
    </div>
  )
}

function FilmOverview({ film }: { film: Film }) {
  const participant = useCurrentParticipant()
  const owner = participant?.id === film.directorId
  const canAddRoles = owner && film.status === 'Active'

  return (
    <>
      <FilmHeader
        film={film}
        aside={<BackButton to={filmPaths.library} label="Back to library" prominent />}
        posterAction={
          owner && (
            <Link
              to={filmPaths.edit(film.id)}
              aria-label={`Edit ${film.title}`}
              title="Edit film"
              className={cn(buttonVariants({ variant: 'secondary', size: 'icon-sm' }), 'shadow-md')}
            >
              <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} />
            </Link>
          )
        }
      />

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-bold">Roles</h2>
          <span className="text-muted-foreground tabular-nums">{formatCount(film.roles.length)}</span>
        </div>
        <Separator />

        {film.roles.length === 0 && canAddRoles && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            This film needs roles before actors can apply.
          </p>
        )}
        {film.status === 'Archived' && (
          <p className="text-sm text-muted-foreground">This film is archived, so it can't get new roles.</p>
        )}

        <ul className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] sm:gap-6">
          {film.roles.map((role) => (
            <li key={role.id}>
              <RoleCard
                role={role}
                action={
                  owner && (
                    <Link
                      to={filmPaths.editRole(film.id, role.id)}
                      aria-label={`Edit ${role.name}`}
                      title="Edit role"
                      className={cn(buttonVariants({ variant: 'secondary', size: 'icon-sm' }), 'shadow-md')}
                    >
                      <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} />
                    </Link>
                  )
                }
              />
            </li>
          ))}
          {canAddRoles && (
            <li>
              <AddTile to={filmPaths.createRole(film.id)} label="Add a role" shape="square" />
            </li>
          )}
        </ul>
      </section>
    </>
  )
}