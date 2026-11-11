import type { ApplicationStatus, RoleApplication } from '@/types/application'
import { request, withQuery } from './http'

export type ApplicationQuery = {
  actorId?: string
  filmRoleId?: string
  status?: ApplicationStatus
}

export const applicationsApi = {
  list: (query: ApplicationQuery = {}) => request<RoleApplication[]>(withQuery('/api/applications', query)),

  apply: (roleId: string) =>
    request<RoleApplication>(`/api/roles/${roleId}/applications`, { method: 'POST', body: {} }),

  pending: () => request<RoleApplication[]>('/api/applications/pending'),

  reorder: (applicationIds: string[]) =>
    request<void>('/api/applications/pending/order', { method: 'PUT', body: { applicationIds } }),

  accept: (applicationId: string) =>
    request<RoleApplication>(`/api/applications/${applicationId}/accept`, { method: 'POST' }),

  reject: (applicationId: string) =>
    request<RoleApplication>(`/api/applications/${applicationId}/reject`, { method: 'POST' }),
}