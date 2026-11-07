import type { ParticipantRole } from '@/types/participant'

export const paths = {
  landing: '/',
  actor: '/actor',
  director: '/director',
  castingDirector: '/casting-director',
  admin: '/admin',
  adminStatistics: '/admin/statistics',
  adminAccounts: '/admin/accounts',
  adminProductions: '/admin/productions',
  adminAuditLogs: '/admin/audit-logs'
} as const

const roleHomePaths: Record<ParticipantRole, string> = {
  Admin: paths.admin,
  Actor: paths.actor,
  Director: paths.director,
  CastingDirector: paths.castingDirector,
}

export const roleHomePath = (role: ParticipantRole) => roleHomePaths[role]
export const rolePath = (role: ParticipantRole, page: string) => `${roleHomePath(role)}/${page}`
export const roleSettingsPath = (role: ParticipantRole) => rolePath(role, 'settings')