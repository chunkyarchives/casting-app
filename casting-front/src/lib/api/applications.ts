import type { ApplicationStatus, RoleApplication } from '@/types/application'
import { request, withQuery } from './http'

export type ApplicationQuery = {
  actorId?: string
  filmRoleId?: string
  status?: ApplicationStatus
}

export const applicationsApi = {
  list: (query: ApplicationQuery = {}) => request<RoleApplication[]>(withQuery('/api/applications', query)),
}