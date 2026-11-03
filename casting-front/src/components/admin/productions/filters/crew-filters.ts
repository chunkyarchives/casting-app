import type { FilterCodec } from '@/hooks/useListFilters'
import type { CrewListQuery, DirectorListQuery } from '@/lib/api/admin'
import { onlyOneChecked, parsePage, pickKnown } from '@/lib/list-filters'

export const presences = ['with', 'without'] as const
export type Presence = (typeof presences)[number]

export type CrewFilters = {
  search: string
  films: Presence[]
  members: Presence[]
  nonProd: boolean
  page: number
}

const crewsPageSize = 20

const urlKeys = {
  search: 'q',
  films: 'films',
  members: 'members',
  nonProd: 'nonprod',
  page: 'page',
} as const

function parse(params: URLSearchParams): CrewFilters {
  return {
    search: params.get(urlKeys.search) ?? '',
    films: pickKnown(presences, params.getAll(urlKeys.films)),
    members: pickKnown(presences, params.getAll(urlKeys.members)),
    nonProd: params.get(urlKeys.nonProd) === '1',
    page: parsePage(params.get(urlKeys.page)),
  }
}

function toSearchParams(filters: CrewFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.search) params.set(urlKeys.search, filters.search)
  filters.films.forEach((value) => params.append(urlKeys.films, value))
  filters.members.forEach((value) => params.append(urlKeys.members, value))
  if (filters.nonProd) params.set(urlKeys.nonProd, '1')
  if (filters.page > 1) params.set(urlKeys.page, String(filters.page))

  return params
}

export const crewFilterCodec: FilterCodec<CrewFilters> = { parse, toSearchParams }

export const toCrewListQuery = (filters: CrewFilters): CrewListQuery => ({
  search: filters.search.trim() || undefined,
  hasFilms: onlyOneChecked(filters.films, 'with'),
  hasMembers: onlyOneChecked(filters.members, 'with'),
  page: filters.page,
  pageSize: crewsPageSize,
})

export const toDirectorListQuery = (filters: CrewFilters): DirectorListQuery => ({
  search: filters.search.trim() || undefined,
  hasProduction: false,
  hasFilms: onlyOneChecked(filters.films, 'with'),
  page: filters.page,
  pageSize: crewsPageSize,
})