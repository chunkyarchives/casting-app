import type {
  AdminAccount,
  AdminAccountDetail,
  AdminCrew,
  AdminCrewDetail,
  AdminFilmDetail,
  AdminStats,
  CrewCodeResult,
  ForceLogoutResult,
  TimelinePoint,
  AdminDirector,
  AdminFilm,
  AdminAction,
  AuditEntry,
} from '@/types/admin'
import type { PagedResult } from '@/types/api'
import type { SignUpRole } from '@/types/participant'
import { request, withQuery } from './http'

export type AccountListQuery = {
  search?: string
  // Empty: every role except Admin
  roles?: readonly SignUpRole[]
  locked?: boolean
  profileComplete?: boolean
  page: number
  pageSize: number
}

export type LockAccountRequest = {
  reason: string
  until?: string
}

export type CrewListQuery = {
  search?: string
  hasFilms?: boolean
  hasMembers?: boolean
  page: number
  pageSize: number
}

export type DirectorListQuery = {
  search?: string
  hasProduction?: boolean
  hasFilms?: boolean
  page: number
  pageSize: number
}

export type AuditListQuery = {
  search?: string
  actions?: readonly AdminAction[]
  targetId?: string
  from?: string
  page: number
  pageSize: number
}

const accountPath = (id: string) => `/api/admin/accounts/${id}`
const crewPath = (id: string) => `/api/admin/crews/${id}`
const filmPath = (id: string) => `/api/admin/films/${id}`
const directorPath = (id: string) => `/api/admin/directors/${id}`

export const adminApi = {
  getStats: () => request<AdminStats>('/api/admin/stats'),

  getTimeline: (days: number) => request<TimelinePoint[]>(withQuery('/api/admin/stats/timeline', { days })),

  listAccounts: (query: AccountListQuery) => request<PagedResult<AdminAccount>>(withQuery('/api/admin/accounts', query)),

  getAccount: (id: string) => request<AdminAccountDetail>(accountPath(id)),

  lockAccount: (id: string, body: LockAccountRequest) => request<AdminAccount>(`${accountPath(id)}/lock`, { method: 'POST', body }),

  unlockAccount: (id: string, reason?: string) => request<AdminAccount>(withQuery(`${accountPath(id)}/unlock`, { reason }), { method: 'POST' }),

  forceLogout: (id: string, reason?: string) => request<ForceLogoutResult>(withQuery(`${accountPath(id)}/force-logout`, { reason }), { method: 'POST' }),

  deleteAccount: (id: string, reason: string) => request<void>(withQuery(accountPath(id), { reason }), { method: 'DELETE' }),

  listCrews: (query: CrewListQuery) => request<PagedResult<AdminCrew>>(withQuery('/api/admin/crews', query)),

  getCrew: (id: string) => request<AdminCrewDetail>(crewPath(id)),

  regenerateCrewCode: (id: string, reason?: string) => request<CrewCodeResult>(withQuery(`${crewPath(id)}/regenerate-code`, { reason }), { method: 'POST' }),

  removeCrewMember: (crewId: string, castingDirectorId: string, reason: string) => request<void>(withQuery(`${crewPath(crewId)}/members/${castingDirectorId}`, { reason }), { method: 'DELETE' }),

  deleteCrew: (id: string, reason: string) => request<void>(withQuery(crewPath(id), { reason }), { method: 'DELETE' }),

  getFilm: (id: string) => request<AdminFilmDetail>(filmPath(id)),

  deleteFilm: (id: string, reason: string) => request<void>(withQuery(filmPath(id), { reason }), { method: 'DELETE' }),

  listDirectors: (query: DirectorListQuery) => request<PagedResult<AdminDirector>>(withQuery('/api/admin/directors', query)),

  getDirectorFilms: (id: string) => request<AdminFilm[]>(`${directorPath(id)}/films`),

  listAudit: (query: AuditListQuery) => request<PagedResult<AuditEntry>>(withQuery('/api/admin/audit', query)),
}