import type { ParticipantRole } from '@/types/participant'

export const paths = {
  landing: '/',
  actor: '/actor',
  director: '/director',
  castingDirector: '/casting-director',
  admin: '/admin',
  adminStatistics: '/admin/statistics',
} as const

const roleHomePaths: Record<ParticipantRole, string> = {
  Admin: paths.admin,
  Actor: paths.actor,
  Director: paths.director,
  CastingDirector: paths.castingDirector,
}

export const roleHomePath = (role: ParticipantRole) => roleHomePaths[role]
export const roleSettingsPath = (role: ParticipantRole) => `${roleHomePath(role)}/settings`