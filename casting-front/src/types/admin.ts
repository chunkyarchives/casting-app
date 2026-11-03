import type { Film, FilmStatus } from '@/types/film'
import type { ParticipantRole } from '@/types/participant'

export type AccountStats = {
  total: number
  actors: number
  directors: number
  castingDirectors: number
  admins: number
  locked: number
  incompleteProfiles: number
}

export type FilmStats = {
  total: number
  active: number
  archived: number
  openRoles: number
  filledRoles: number
}

export type ApplicationStats = {
  total: number
  proposed: number
  accepted: number
  rejected: number
}

export type ChatStats = {
  conversations: number
  messages: number
}

export type MediaStats = {
  files: number
  totalBytes: number
}

export type AdminStats = {
  accounts: AccountStats
  films: FilmStats
  applications: ApplicationStats
  chat: ChatStats
  media: MediaStats
}

export type TimelinePoint = {
  date: string // "2026-10-28" (DateOnly on the backend)
  registrations: number
  films: number
  messages: number
}

export type AdminAccount = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: ParticipantRole
  profileComplete: boolean
  locked: boolean
  createdAt: string // ISO date-time
}

export type AdminAccountDetail = AdminAccount & {
  profileCompletedAt: string | null
  lockedUntil: string | null 
  lockReason: string | null
  lastActiveAt: string | null
  activeSessions: number
  films: number
  applications: number
  conversations: number
  mediaFiles: number
  mediaBytes: number
}

export type ForceLogoutResult = {
  sessionsEnded: number
}

export type AdminFilm = {
  id: string
  title: string
  status: FilmStatus
  directorId: string
  directorName: string
  roleCount: number
  createdAt: string
  posterUrl: string | null
}

export type RoleApplicationCounts = {
  roleId: string
  proposed: number
  accepted: number
  rejected: number
}

export type AdminFilmDetail = {
  film: Film
  directorName: string
  applications: RoleApplicationCounts[]
}

export type AdminCrew = {
  id: string
  productionName: string
  productionCode: string
  directorId: string
  directorName: string
  memberCount: number
  filmCount: number
  createdAt: string
}

export type AdminCrewMember = {
  castingDirectorId: string
  firstName: string
  lastName: string
  email: string
  joinedAt: string
}

export type AdminCrewDetail = {
  id: string
  productionName: string
  productionCode: string
  createdAt: string
  directorId: string
  directorName: string
  directorEmail: string
  members: AdminCrewMember[]
  films: AdminFilm[]
}

export type CrewCodeResult = {
  productionCode: string
}

export type AdminDirector = {
  id: string
  name: string
  email: string
  hasProduction: boolean
  filmCount: number
  createdAt: string
}

export const adminActions = [
  'LockAccount',
  'UnlockAccount',
  'ForceLogout',
  'DeleteAccount',
  'RegenerateCrewCode',
  'RemoveCrewMember',
  'DeleteCrew',
  'DeleteFilm',
  'DeleteConversation',
] as const
export type AdminAction = (typeof adminActions)[number]

export type AuditEntry = {
  id: string
  adminId: string
  adminEmail: string
  action: AdminAction
  targetType: string
  targetId: string
  targetLabel: string
  reason: string | null
  createdAt: string
}