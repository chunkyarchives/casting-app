import type { PagedResult } from '@/types/api'
import type { SignUpRole } from '@/types/participant'
import type { PublicFilm, PublicPerson, PublicRole } from '@/types/public'
import { request, withQuery } from './http'

export type PublicFilmQuery = {
  search?: string
  page: number
  pageSize: number
}

export type PublicPeopleQuery = PublicFilmQuery & {
  role?: SignUpRole
}

export const publicApi = {
  films: (query: PublicFilmQuery) => request<PagedResult<PublicFilm>>(withQuery('/api/public/films', query)),

  popularRoles: (limit: number) => request<PublicRole[]>(withQuery('/api/public/roles/popular', { limit })),

  people: (query: PublicPeopleQuery) => request<PagedResult<PublicPerson>>(withQuery('/api/public/people', query)),
}