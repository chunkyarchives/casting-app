import { useParams } from 'react-router'
import { FilmEditor as Editor } from '@/components/film/FilmEditor'

export default function FilmEditor() {
  const { filmId } = useParams()
  return <Editor key={filmId ?? 'new'} filmId={filmId} />
}