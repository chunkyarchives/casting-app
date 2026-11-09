import { prefetchQuery, type QuerySpec } from '@/hooks/useApiQuery'
import type { FilterCodec } from '@/hooks/useListFilters'
import { publicApi } from '@/lib/api/public'
import { parsePage, pickKnown } from '@/lib/list-filters'
import type { PagedResult } from '@/types/api'
import { signUpRoles, type SignUpRole } from '@/types/participant'
import type { PublicFilm, PublicPerson, PublicRole } from '@/types/public'

export type FilmFilters = {
  search: string
  page: number
}

export type PeopleFilters = FilmFilters & {
  role: SignUpRole | null
}

const pageSize = 12
const popularRolesLimit = 12

const urlKeys = {
  search: 'q',
  role: 'role',
  page: 'page',
} as const

function toSearchParams(filters: FilmFilters, role: SignUpRole | null = null) {
  const params = new URLSearchParams()

  if (filters.search) params.set(urlKeys.search, filters.search)
  if (role) params.set(urlKeys.role, role)
  if (filters.page > 1) params.set(urlKeys.page, String(filters.page))

  return params
}

export const filmFilterCodec: FilterCodec<FilmFilters> = {
  parse: (params) => ({
    search: params.get(urlKeys.search) ?? '',
    page: parsePage(params.get(urlKeys.page)),
  }),
  toSearchParams: (filters) => toSearchParams(filters),
}

export const peopleFilterCodec: FilterCodec<PeopleFilters> = {
  parse: (params) => ({
    search: params.get(urlKeys.search) ?? '',
    role: pickKnown(signUpRoles, params.getAll(urlKeys.role))[0] ?? null,
    page: parsePage(params.get(urlKeys.page)),
  }),
  toSearchParams: (filters) => toSearchParams(filters, filters.role),
}

export function filmsQuery(filters: FilmFilters): QuerySpec<PagedResult<PublicFilm>> {
  const query = { search: filters.search.trim() || undefined, page: filters.page, pageSize }
  return { key: `public-films-${JSON.stringify(query)}`, load: () => publicApi.films(query) }
}

export function peopleQuery(filters: PeopleFilters): QuerySpec<PagedResult<PublicPerson>> {
  const query = { search: filters.search.trim() || undefined, role: filters.role ?? undefined, page: filters.page, pageSize }
  return { key: `public-people-${JSON.stringify(query)}`, load: () => publicApi.people(query) }
}

export function popularRolesQuery(): QuerySpec<PublicRole[]> {
  return { key: `public-popular-roles-${popularRolesLimit}`, load: () => publicApi.popularRoles(popularRolesLimit) }
}

const noFilters = new URLSearchParams()

export function prefetchPublicLists() {
  prefetchQuery(filmsQuery(filmFilterCodec.parse(noFilters)))
  prefetchQuery(popularRolesQuery())
  prefetchQuery(peopleQuery(peopleFilterCodec.parse(noFilters)))
}