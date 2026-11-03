import { accountsListQuery } from '@/components/admin/accounts/accounts-list'
import { accountFilterCodec } from '@/components/admin/accounts/filters/account-filters'
import { auditListQuery } from '@/components/admin/audit/audit-list'
import { readClearedAt } from '@/components/admin/audit/cleared-log'
import { auditFilterCodec } from '@/components/admin/audit/filters/audit-filters'
import { crewFilterCodec } from '@/components/admin/productions/filters/crew-filters'
import { productionsListQuery } from '@/components/admin/productions/production-rows'
import { prefetchQuery } from '@/hooks/useApiQuery'

const noFilters = new URLSearchParams()

export function prefetchAdminLists() {
  prefetchQuery(accountsListQuery(accountFilterCodec.parse(noFilters)))
  prefetchQuery(productionsListQuery(crewFilterCodec.parse(noFilters)))
  prefetchQuery(auditListQuery(auditFilterCodec.parse(noFilters), readClearedAt()))
}