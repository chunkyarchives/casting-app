import type {
  Film,
  FilmRole,
  FilmSummary,
  SaveFilmRequest,
  SaveFilmRoleRequest,
  UpdateFilmRequest,
  UpdateFilmRoleRequest,
} from '@/types/film'
import type { MediaItem } from '@/types/media'
import { request } from './http'

const pictureForm = (picture: Blob, name: string, caption?: string | null) => {
  const form = new FormData()
  form.append('file', picture, name)
  if (caption) form.append('caption', caption)
  return form
}

export const filmsApi = {
  mine: () => request<FilmSummary[]>('/api/films/mine'),

  get: (filmId: string) => request<Film>(`/api/films/${filmId}`),

  create: (body: SaveFilmRequest) => request<Film>('/api/films', { method: 'POST', body }),

  update: (filmId: string, body: UpdateFilmRequest) => request<Film>(`/api/films/${filmId}`, { method: 'PUT', body }),

  remove: (filmId: string) => request<void>(`/api/films/${filmId}`, { method: 'DELETE' }),

  uploadPoster: (filmId: string, poster: Blob) =>
    request<MediaItem>(`/api/films/${filmId}/poster`, { method: 'PUT', body: pictureForm(poster, 'poster.jpg') }),

  removePoster: (filmId: string) => request<void>(`/api/films/${filmId}/poster`, { method: 'DELETE' }),
}

export const filmRolesApi = {
  get: (roleId: string) => request<FilmRole>(`/api/roles/${roleId}`),

  create: (filmId: string, body: SaveFilmRoleRequest) =>
    request<FilmRole>(`/api/films/${filmId}/roles`, { method: 'POST', body }),

  update: (roleId: string, body: UpdateFilmRoleRequest) =>
    request<FilmRole>(`/api/roles/${roleId}`, { method: 'PUT', body }),

  remove: (roleId: string) => request<void>(`/api/roles/${roleId}`, { method: 'DELETE' }),

  addConceptArt: (roleId: string, picture: Blob, caption: string | null) =>
    request<MediaItem>(`/api/roles/${roleId}/concept-art`, {
      method: 'POST',
      body: pictureForm(picture, 'concept-art.jpg', caption),
    }),

  removeConceptArt: (roleId: string, mediaId: string) =>
    request<void>(`/api/roles/${roleId}/concept-art/${mediaId}`, { method: 'DELETE' }),
}