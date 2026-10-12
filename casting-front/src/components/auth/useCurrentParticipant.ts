import type { ParticipantRole } from '@/types/participant'

export type CurrentParticipant = {
  username: string
  firstName: string
  role: ParticipantRole
}

export function useCurrentParticipant(): CurrentParticipant | null {
  // TODO: read from the auth state, filled by GET /api/auth/me
  return null
}