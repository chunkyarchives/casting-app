import type { AccountListQuery } from '@/lib/api/admin'
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

export const accountsPageSize = 20

const urlKeys = {
  search: 'q',
  role: 'role',
  status: 'status',
  profile: 'profile',
  page: 'page',
} as const

const pickKnown = <T extends string>(known: readonly T[], values: string[]) =>
  known.filter((value) => values.includes(value))

export function parseAccountFilters(params: URLSearchParams): AccountFilters {
  const page = Number(params.get(urlKeys.page))

  return {
    search: params.get(urlKeys.search) ?? '',
    roles: pickKnown(signUpRoles, params.getAll(urlKeys.role)),
    statuses: pickKnown(accountStatuses, params.getAll(urlKeys.status)),
    profiles: pickKnown(profileStates, params.getAll(urlKeys.profile)),
    page: Number.isInteger(page) && page > 1 ? page : 1,
  }
}

export function toSearchParams(filters: AccountFilters): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.search) params.set(urlKeys.search, filters.search)
  filters.roles.forEach((role) => params.append(urlKeys.role, role))
  filters.statuses.forEach((status) => params.append(urlKeys.status, status))
  filters.profiles.forEach((profile) => params.append(urlKeys.profile, profile))
  if (filters.page > 1) params.set(urlKeys.page, String(filters.page))

  return params
}

const onlyOneChecked = <T extends string>(checked: T[], yes: T): boolean | undefined =>
  checked.length === 1 ? checked[0] === yes : undefined

export const toAccountListQuery = (filters: AccountFilters): AccountListQuery => ({
  search: filters.search.trim() || undefined,
  roles: filters.roles,
  locked: onlyOneChecked(filters.statuses, 'locked'),
  profileComplete: onlyOneChecked(filters.profiles, 'complete'),
  page: filters.page,
  pageSize: accountsPageSize,
})