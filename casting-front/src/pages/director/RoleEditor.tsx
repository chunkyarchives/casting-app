import { useParams } from 'react-router'
import { RoleEditor as Editor } from '@/components/film/RoleEditor'

export default function RoleEditor() {
  const { filmId = '', roleId } = useParams()
  return <Editor key={`${filmId}-${roleId ?? 'new'}`} filmId={filmId} roleId={roleId} />
}