import type { Actor, ActorListQuery, ActorSummary, UpdateActorRequest } from '@/types/actor'
import type { PagedResult } from '@/types/api'
import { request, withQuery } from './http'

export const actorsApi = {
  list: (query: ActorListQuery) => request<PagedResult<ActorSummary>>(withQuery('/api/actors', query)),

  get: (id: string) => request<Actor>(`/api/actors/${id}`),

  update: (id: string, body: UpdateActorRequest) =>
    request<Actor>(`/api/actors/${id}`, { method: 'PUT', body }),
}