import type { MediaItem, PhotoKind } from '@/types/media'
import { request } from './http'

const mediaForm = (file: Blob, name: string, caption: string | null, kind?: PhotoKind) => {
  const form = new FormData()
  if (kind) form.append('kind', kind)
  if (caption) form.append('caption', caption)
  form.append('file', file, name)
  return form
}

export const portfolioApi = {
  photos: (actorId: string) => request<MediaItem[]>(`/api/actors/${actorId}/photos`),

  showreels: (actorId: string) => request<MediaItem[]>(`/api/actors/${actorId}/showreels`),

  addPhoto: (kind: PhotoKind, picture: Blob, caption: string | null) =>
    request<MediaItem>('/api/me/photos', { method: 'POST', body: mediaForm(picture, 'photo.jpg', caption, kind) }),

  addShowreel: (video: File, caption: string | null) =>
    request<MediaItem>('/api/me/showreels', { method: 'POST', body: mediaForm(video, video.name, caption) }),

  updateCaption: (mediaId: string, caption: string | null) =>
    request<MediaItem>(`/api/me/media/${mediaId}/caption`, { method: 'PUT', body: { caption } }),

  remove: (mediaId: string) => request<void>(`/api/me/media/${mediaId}`, { method: 'DELETE' }),
}