import type { QuerySpec } from '@/hooks/useApiQuery'
import type { FilterCodec } from '@/hooks/useListFilters'
import { actorsApi } from '@/lib/api/actors'
import { filmRolesApi } from '@/lib/api/films'
import { parsePage } from '@/lib/list-filters'
import type { ActorSummary } from '@/types/actor'
import type { PagedResult } from '@/types/api'
import type { MatchmakingRole } from '@/types/film'

export type ActorFilters = {
  search: string
  page: number
}

const actorPageSize = 12

const urlKeys = {
  search: 'q',
  page: 'page',
} as const

export const actorFilterCodec: FilterCodec<ActorFilters> = {
  parse: (params) => ({
    search: params.get(urlKeys.search) ?? '',
    page: parsePage(params.get(urlKeys.page)),
  }),
  toSearchParams: (filters) => {
    const params = new URLSearchParams()
    if (filters.search) params.set(urlKeys.search, filters.search)
    if (filters.page > 1) params.set(urlKeys.page, String(filters.page))
    return params
  },
}

export function actorPoolQuery(filters: ActorFilters): QuerySpec<PagedResult<ActorSummary>> {
  const query = { search: filters.search.trim() || undefined, page: filters.page, pageSize: actorPageSize }
  return { key: `matchmaking-actors-${JSON.stringify(query)}`, load: () => actorsApi.list(query) }
}

export const matchmakingRolesKey = 'matchmaking-roles'

export const matchmakingRolesQuery: QuerySpec<MatchmakingRole[]> = {
  key: matchmakingRolesKey,
  load: () => filmRolesApi.matchmaking(),
}