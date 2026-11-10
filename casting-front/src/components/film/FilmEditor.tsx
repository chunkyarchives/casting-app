import { Film01Icon } from '@hugeicons/core-free-icons'
import { LoadError } from '@/components/common/states/LoadError'
import { PageLoader } from '@/components/common/states/PageLoader'
import { BackButton } from '@/components/film/director/BackButton'
import { FilmForm } from '@/components/film/form/FilmForm'
import { useFilm } from '@/components/film/hooks/useFilms'
import { SettingsScreen } from '@/components/settings/SettingsScreen'
import { filmPaths } from '@/lib/routes'

export function FilmEditor({ filmId }: { filmId?: string }) {
  if (!filmId) {
    return (
      <SettingsScreen title="New film" icon={Film01Icon} back={<BackButton to={filmPaths.library} label="Films" />}>
        <FilmForm film={null} />
      </SettingsScreen>
    )
  }

  return <EditFilm filmId={filmId} />
}

function EditFilm({ filmId }: { filmId: string }) {
  const film = useFilm(filmId)

  return (
    <SettingsScreen
      title="Edit film"
      icon={Film01Icon}
      back={<BackButton to={filmPaths.film(filmId)} label={film.status === 'success' ? film.data.title : 'Film'} />}
    >
      {film.status === 'loading' && <PageLoader />}
      {film.status === 'error' && <LoadError title="This film could not be loaded" error={film.error} onRetry={film.reload} />}
      {film.status === 'success' && <FilmForm key={film.data.id} film={film.data} />}
    </SettingsScreen>
  )
}