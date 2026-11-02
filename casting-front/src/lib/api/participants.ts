import { apiBaseUrl } from '@/lib/config'

export const profilePictureUrl = (participantId: string) => `${apiBaseUrl}/api/participants/${participantId}/profile-picture`