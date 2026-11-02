import type { AdminAccount, AdminAccountDetail, AdminStats, ForceLogoutResult, TimelinePoint } from '@/types/admin'
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

const accountPath = (id: string) => `/api/admin/accounts/${id}`

export const adminApi = {
  getStats: () => request<AdminStats>('/api/admin/stats'),

  // The backend accepts 1 to 90 days
  getTimeline: (days: number) =>
    request<TimelinePoint[]>(withQuery('/api/admin/stats/timeline', { days })),

  listAccounts: (query: AccountListQuery) =>
    request<PagedResult<AdminAccount>>(withQuery('/api/admin/accounts', query)),

  getAccount: (id: string) => request<AdminAccountDetail>(accountPath(id)),

  lockAccount: (id: string, body: LockAccountRequest) =>
    request<AdminAccount>(`${accountPath(id)}/lock`, { method: 'POST', body }),

  unlockAccount: (id: string, reason?: string) =>
    request<AdminAccount>(withQuery(`${accountPath(id)}/unlock`, { reason }), { method: 'POST' }),

  forceLogout: (id: string, reason?: string) =>
    request<ForceLogoutResult>(withQuery(`${accountPath(id)}/force-logout`, { reason }), { method: 'POST' }),

  deleteAccount: (id: string, reason: string) =>
    request<void>(withQuery(accountPath(id), { reason }), { method: 'DELETE' }),
}