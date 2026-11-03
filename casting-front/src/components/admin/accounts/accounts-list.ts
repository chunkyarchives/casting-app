import type { QuerySpec } from '@/hooks/useApiQuery'
import { adminApi } from '@/lib/api/admin'
import type { AdminAccount } from '@/types/admin'
import type { PagedResult } from '@/types/api'
import { toAccountListQuery, type AccountFilters } from './filters/account-filters'

export function accountsListQuery(filters: AccountFilters): QuerySpec<PagedResult<AdminAccount>> {
  const query = toAccountListQuery(filters)
  return { key: `admin-accounts-${JSON.stringify(query)}`, load: () => adminApi.listAccounts(query) }
}