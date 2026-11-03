import type { QuerySpec } from '@/hooks/useApiQuery'
import { adminApi } from '@/lib/api/admin'
import type { AuditEntry } from '@/types/admin'
import type { PagedResult } from '@/types/api'
import { toAuditListQuery, type AuditFilters } from './filters/audit-filters'

export function auditListQuery(filters: AuditFilters, clearedAt: string | null): QuerySpec<PagedResult<AuditEntry>> {
  const query = toAuditListQuery(filters, clearedAt)
  return { key: `admin-audit-${JSON.stringify(query)}`, load: () => adminApi.listAudit(query) }
}