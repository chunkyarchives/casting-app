import { useApiQuery } from '@/hooks/useApiQuery'
import { filmsApi } from '@/lib/api/films'
import { filmKey, myFilmsKey } from './film-cache'

export const useMyFilms = () => useApiQuery(myFilmsKey, filmsApi.mine)

export const useFilm = (filmId: string) => useApiQuery(filmKey(filmId), () => filmsApi.get(filmId))