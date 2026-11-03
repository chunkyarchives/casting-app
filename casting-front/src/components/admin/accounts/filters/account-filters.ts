import type { FilterCodec } from '@/hooks/useListFilters'
import type { AccountListQuery } from '@/lib/api/admin'
import { onlyOneChecked, parsePage, pickKnown } from '@/lib/list-filters'
import { signUpRoles, type SignUpRole } from '@/types/participant'

export const accountStatuses = ['active', 'locked'] as const
export type AccountStatus = (typeof accountStatuses)[number]

export const profileStates = ['complete', 'incomplete'] as const
export type ProfileState = (typeof profileStates)[number]

export type AccountFilters = {
  search: string
  roles: SignUpRole[]
  statuses: AccountStatus[]
  profiles: ProfileState[]
  page: number
}

const accountsPageSize = 20

const urlKeys = {
  search: 'q',
  role: 'role',
  status: 'status',
  profile: 'profile',
  page: 'page',
} as const

function parse(params: URLSearchParams): AccountFilters {
  return {
    search: params.get(urlKeys.search) ?? '',
    roles: pickKnown(signUpRoles, params.getAll(urlKeys.role)),
    statuses: pickKnown(accountStatuses, params.getAll(urlKeys.status)),
    profiles: pickKnown(profileStates, params.getAll(urlKeys.profile)),
    page: parsePage(params.get(urlKeys.page)),
  }
}

function toSearchParams(filters: AccountFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.search) params.set(urlKeys.search, filters.search)
  filters.roles.forEach((role) => params.append(urlKeys.role, role))
  filters.statuses.forEach((status) => params.append(urlKeys.status, status))
  filters.profiles.forEach((profile) => params.append(urlKeys.profile, profile))
  if (filters.page > 1) params.set(urlKeys.page, String(filters.page))

  return params
}

export const accountFilterCodec: FilterCodec<AccountFilters> = { parse, toSearchParams }

export const toAccountListQuery = (filters: AccountFilters): AccountListQuery => ({
  search: filters.search.trim() || undefined,
  roles: filters.roles,
  locked: onlyOneChecked(filters.statuses, 'locked'),
  profileComplete: onlyOneChecked(filters.profiles, 'complete'),
  page: filters.page,
  pageSize: accountsPageSize,
})