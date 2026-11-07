import type { Actor, UpdateActorRequest } from '@/types/actor'
import { request } from './http'

export const actorsApi = {
  get: (id: string) => request<Actor>(`/api/actors/${id}`),

  update: (id: string, body: UpdateActorRequest) =>
    request<Actor>(`/api/actors/${id}`, { method: 'PUT', body }),
}