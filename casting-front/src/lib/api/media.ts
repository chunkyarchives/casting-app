import { apiBaseUrl } from '@/lib/config'
import { request } from './http'

export const mediaUrl = (relativeUrl: string) => `${apiBaseUrl}${relativeUrl}`

export type ProfilePicture = {
  assetId: string
  url: string
}

export const profilePictureApi = {
  upload: (picture: Blob) => {
    const form = new FormData()
    form.append('file', picture, 'profile-picture.jpg')
    return request<ProfilePicture>('/api/me/profile-picture', { method: 'PUT', body: form })
  },

  remove: () => request<void>('/api/me/profile-picture', { method: 'DELETE' }),
}