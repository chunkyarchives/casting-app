import type { ParticipantRole } from '@/types/participant'

export const roleLabels: Record<ParticipantRole, string> = {
  Admin: 'Admin',
  Actor: 'Actor',
  Director: 'Director',
  CastingDirector: 'Casting director',
}