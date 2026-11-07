import { apiBaseUrl } from '@/lib/config'
import { mediaUrl } from './media'

export const profilePictureUrl = (participantId: string) => `${apiBaseUrl}/api/participants/${participantId}/profile-picture`

export const profilePictureSource = (participantId: string, pictureUrl?: string | null) => {
  if (pictureUrl === undefined) return profilePictureUrl(participantId)
  return pictureUrl ? mediaUrl(pictureUrl) : null
}