import { MaskTheater01Icon } from '@hugeicons/core-free-icons'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { LoadError } from '@/components/common/states/LoadError'
import { PageLoader } from '@/components/common/states/PageLoader'
import { BackButton } from '@/components/film/director/BackButton'
import { RoleForm } from '@/components/film/form/RoleForm'
import { useFilm } from '@/components/film/hooks/useFilms'
import { SettingsScreen } from '@/components/settings/SettingsScreen'
import { filmPaths } from '@/lib/routes'
import type { Film } from '@/types/film'

type Props = {
  filmId: string
  roleId?: string
}

export function RoleEditor({ filmId, roleId }: Props) {
  const film = useFilm(filmId)

  return (
    <SettingsScreen
      title={roleId ? 'Edit role' : 'New role'}
      icon={MaskTheater01Icon}
      back={<BackButton to={filmPaths.film(filmId)} label={film.status === 'success' ? film.data.title : 'Film'} />}
    >
      {film.status === 'loading' && <PageLoader />}
      {film.status === 'error' && <LoadError title="This film could not be loaded" error={film.error} onRetry={film.reload} />}
      {film.status === 'success' && <RoleFormFor film={film.data} roleId={roleId} />}
    </SettingsScreen>
  )
}

function RoleFormFor({ film, roleId }: { film: Film; roleId?: string }) {
  if (!roleId) return <RoleForm film={film} role={null} />

  const role = film.roles.find((current) => current.id === roleId)
  if (!role) return <EmptyMessage icon={MaskTheater01Icon} title="This role doesn't exist anymore" />

  return <RoleForm key={role.id} film={film} role={role} />
}