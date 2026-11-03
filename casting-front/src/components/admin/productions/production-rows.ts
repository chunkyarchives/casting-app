import { adminApi } from '@/lib/api/admin'
import type { AdminCrew, AdminDirector } from '@/types/admin'
import type { PagedResult } from '@/types/api'
import type { QuerySpec } from '@/hooks/useApiQuery'
import { toCrewListQuery, toDirectorListQuery, type CrewFilters } from './filters/crew-filters'

type DirectorPart = {
  directorId: string
  directorName: string
  filmCount: number
}

export type ProductionRow =
  | (DirectorPart & { crew: AdminCrew })
  | (DirectorPart & { crew: null; directorEmail: string })

export type CrewRow = Extract<ProductionRow, { crew: AdminCrew }>
export type NoProductionRow = Extract<ProductionRow, { crew: null }>

const fromCrew = (crew: AdminCrew): ProductionRow => ({
  directorId: crew.directorId,
  directorName: crew.directorName,
  filmCount: crew.filmCount,
  crew,
})

const fromDirector = (director: AdminDirector): ProductionRow => ({
  directorId: director.id,
  directorName: director.name,
  filmCount: director.filmCount,
  crew: null,
  directorEmail: director.email,
})

export const siteMemberCount = (row: ProductionRow) => (row.crew ? row.crew.memberCount : 0) + 1

export async function listProductionRows(filters: CrewFilters): Promise<PagedResult<ProductionRow>> {
  if (filters.nonProd) {
    const result = await adminApi.listDirectors(toDirectorListQuery(filters))
    return { ...result, items: result.items.map(fromDirector) }
  }

  const result = await adminApi.listCrews(toCrewListQuery(filters))
  return { ...result, items: result.items.map(fromCrew) }
}

export const productionsListQuery = (filters: CrewFilters): QuerySpec<PagedResult<ProductionRow>> => ({
  key: `admin-productions-${JSON.stringify(filters)}`,
  load: () => listProductionRows(filters),
})