import type { CastingDirector, UpdateCastingDirectorRequest } from '@/types/casting-director'
import { request } from './http'

export const castingDirectorsApi = {
  get: (id: string) => request<CastingDirector>(`/api/casting-directors/${id}`),

  update: (id: string, body: UpdateCastingDirectorRequest) =>
    request<CastingDirector>(`/api/casting-directors/${id}`, { method: 'PUT', body }),
}