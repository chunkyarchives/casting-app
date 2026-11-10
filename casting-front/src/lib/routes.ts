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
  adminAuditLogs: '/admin/audit-logs',
  movies: '/movies',
  roles: '/roles',
  network: '/network',
} as const

const joinPath = (...segments: string[]) => segments.join('/')

const filmLibrary = joinPath(paths.director, 'films')
const filmPath = (filmId: string) => joinPath(filmLibrary, filmId)

export const filmPaths = {
  library: filmLibrary,
  create: joinPath(filmLibrary, 'new'),
  film: filmPath,
  edit: (filmId: string) => joinPath(filmPath(filmId), 'edit'),
  createRole: (filmId: string) => joinPath(filmPath(filmId), 'roles', 'new'),
  editRole: (filmId: string, roleId: string) => joinPath(filmPath(filmId), 'roles', roleId, 'edit'),
}

const roleHomePaths: Record<ParticipantRole, string> = {
  Admin: paths.admin,
  Actor: paths.actor,
  Director: paths.director,
  CastingDirector: paths.castingDirector,
}

export const roleHomePath = (role: ParticipantRole) => roleHomePaths[role]
export const rolePath = (role: ParticipantRole, page: string) => joinPath(roleHomePath(role), page)
export const roleSettingsPath = (role: ParticipantRole) => rolePath(role, 'settings')

const dashboardRoots = [paths.actor, paths.director, paths.castingDirector]

export const isDashboardPath = (pathname: string) => dashboardRoots.some((root) => pathname === root || pathname.startsWith(`${root}/`))