import { PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, useNavigate } from 'react-router'
import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'
import { AddTile } from '@/components/common/actions/AddTile'
import { DeleteButton } from '@/components/common/actions/DeleteButton'
import { overlayActionClass } from '@/components/common/actions/overlay-action'
import { SectionTitle } from '@/components/common/display/SectionTitle'
import { LoadError } from '@/components/common/states/LoadError'
import { PageLoader } from '@/components/common/states/PageLoader'
import { BackButton } from '@/components/film/director/BackButton'
import { forgetFilm, forgetRole } from '@/components/film/hooks/film-cache'
import { useFilm } from '@/components/film/hooks/useFilms'
import { FilmHeader } from '@/components/film/shared/FilmHeader'
import { RoleCard } from '@/components/film/shared/RoleCard'
import { roleGrid } from '@/components/film/shared/role-grid'
import { toast } from '@/components/ui/toast'
import { filmRolesApi, filmsApi } from '@/lib/api/films'
import { filmPaths } from '@/lib/routes'
import type { Film, FilmRole } from '@/types/film'

export function DirectorFilm({ filmId }: { filmId: string }) {
  const film = useFilm(filmId)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pt-2 pb-32">
      {film.status !== 'success' && <BackButton to={filmPaths.library} label="Back to library" />}

      {film.status === 'loading' && <PageLoader />}
      {film.status === 'error' && <LoadError title="This film could not be loaded" error={film.error} onRetry={film.reload} />}
      {film.status === 'success' && <FilmOverview film={film.data} onChange={film.setData} />}
    </div>
  )
}

type OverviewProps = {
  film: Film
  onChange: (film: Film) => void
}

function FilmOverview({ film, onChange }: OverviewProps) {
  const navigate = useNavigate()
  const participant = useCurrentParticipant()
  const owner = participant?.id === film.directorId
  const canAddRoles = owner && film.status === 'Active'

  const removeFilm = async () => {
    await filmsApi.remove(film.id)
    forgetFilm(film.id)
    toast.add({ type: 'success', title: `${film.title} was deleted` })
    void navigate(filmPaths.library, { replace: true })
  }

  const removeRole = async (role: FilmRole) => {
    await filmRolesApi.remove(role.id)
    onChange(forgetRole(film, role.id))
    toast.add({ type: 'success', title: `${role.name} was deleted` })
  }

  return (
    <>
      <FilmHeader
        film={film}
        aside={<BackButton to={filmPaths.library} label="Back to library" />}
        posterAction={
          owner && (
            <>
              <Link to={filmPaths.edit(film.id)} aria-label={`Edit ${film.title}`} title="Edit film" className={overlayActionClass}>
                <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} />
              </Link>
              <DeleteButton
                label={`Delete ${film.title}`}
                confirmLabel="Delete film"
                title={`Delete ${film.title}?`}
                description="The film, its poster, all of its roles and every application for them are removed. This can't be undone."
                onDelete={removeFilm}
              />
            </>
          )
        }
      />

      <section className="flex flex-col gap-4">
        <SectionTitle>Roles</SectionTitle>

        {film.roles.length === 0 && canAddRoles && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            This film needs roles before actors can apply.
          </p>
        )}
        {film.status === 'Archived' && (
          <p className="text-sm text-muted-foreground">This film is archived, so it can't get new roles.</p>
        )}

        <ul className={roleGrid}>
          {film.roles.map((role) => (
            <li key={role.id}>
              <RoleCard
                role={role}
                action={
                  owner && (
                    <>
                      <Link
                        to={filmPaths.editRole(film.id, role.id)}
                        aria-label={`Edit ${role.name}`}
                        title="Edit role"
                        className={overlayActionClass}
                      >
                        <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} />
                      </Link>
                      <DeleteButton
                        label={`Delete ${role.name}`}
                        confirmLabel="Delete role"
                        title={`Delete ${role.name}?`}
                        description="The role, its concept art and every application for it are removed. This can't be undone."
                        onDelete={() => removeRole(role)}
                      />
                    </>
                  )
                }
              />
            </li>
          ))}
          {canAddRoles && (
            <li>
              <AddTile to={filmPaths.createRole(film.id)} label="Add a role" shape="card" />
            </li>
          )}
        </ul>
      </section>
    </>
  )
}