import type { FilterCodec } from '@/hooks/useListFilters'
import type { AuditListQuery } from '@/lib/api/admin'
import { parsePage, pickKnown } from '@/lib/list-filters'
import { adminActions, type AdminAction } from '@/types/admin'

export type AuditFilters = {
  search: string
  actions: AdminAction[]
  target: string
  page: number
}

const auditPageSize = 20

const urlKeys = {
  search: 'q',
  action: 'action',
  target: 'target',
  page: 'page',
} as const

const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function parse(params: URLSearchParams): AuditFilters {
  const target = params.get(urlKeys.target) ?? ''

  return {
    search: params.get(urlKeys.search) ?? '',
    actions: pickKnown(adminActions, params.getAll(urlKeys.action)),
    target: idPattern.test(target) ? target : '',
    page: parsePage(params.get(urlKeys.page)),
  }
}

function toSearchParams(filters: AuditFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.search) params.set(urlKeys.search, filters.search)
  filters.actions.forEach((action) => params.append(urlKeys.action, action))
  if (filters.target) params.set(urlKeys.target, filters.target)
  if (filters.page > 1) params.set(urlKeys.page, String(filters.page))

  return params
}

export const auditFilterCodec: FilterCodec<AuditFilters> = { parse, toSearchParams }

export const hasAuditFilters = (filters: AuditFilters) =>
  filters.search !== '' || filters.actions.length > 0 || filters.target !== ''

export const toAuditListQuery = (filters: AuditFilters, clearedAt: string | null): AuditListQuery => ({
  search: filters.search.trim() || undefined,
  actions: filters.actions,
  targetId: filters.target || undefined,
  from: clearedAt ?? undefined,
  page: filters.page,
  pageSize: auditPageSize,
})