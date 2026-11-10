import { useParams } from 'react-router'
import { DirectorFilm } from '@/components/film/DirectorFilm'

export default function Film() {
  const { filmId = '' } = useParams()
  return <DirectorFilm key={filmId} filmId={filmId} />
}