import type { ParticipantRole, SignUpRole } from '@/types/participant'

export const hasOrigin = (role: ParticipantRole) => role === 'Actor' || role === 'Director'

export const roleLabels: Record<ParticipantRole, string> = {
  Admin: 'Admin',
  Actor: 'Actor',
  Director: 'Director',
  CastingDirector: 'Casting director',
}

export const roleDescriptions: Record<SignUpRole, string> = {
  Actor: 'Build your profile and get matched to film roles.',
  Director: 'Create films, open roles and make the final casting decisions.',
  CastingDirector: "Join a director's crew and match actors to roles.",
}