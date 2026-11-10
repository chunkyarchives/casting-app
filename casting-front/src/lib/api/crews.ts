import type { Crew } from '@/types/crew'
import { request } from './http'

export const crewsApi = {
  mine: () => request<Crew[]>('/api/crews/mine'),

  create: (productionName: string) => request<Crew>('/api/crews', { method: 'POST', body: { productionName } }),

  remove: (crewId: string) => request<void>(`/api/crews/${crewId}`, { method: 'DELETE' }),

  join: (productionCode: string) => request<Crew>('/api/crews/join', { method: 'POST', body: { productionCode } }),

  leave: (crewId: string, castingDirectorId: string) => request<void>(`/api/crews/${crewId}/members/${castingDirectorId}`, { method: 'DELETE' }),
}