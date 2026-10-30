import type { AdminStats, TimelinePoint } from '@/types/admin'
import { request } from './http'

export const adminApi = {
  getStats: () => request<AdminStats>('/api/admin/stats'),

  getTimeline: (days: number) =>
    request<TimelinePoint[]>(`/api/admin/stats/timeline?days=${days}`),
}