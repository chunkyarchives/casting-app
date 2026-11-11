import { useState } from 'react'
import { AdminWrap } from '@/components/admin/AdminWrap'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { auditListQuery } from '@/components/admin/audit/audit-list'
import { readClearedAt, saveClearedAt } from '@/components/admin/audit/cleared-log'
import { AuditToolbar } from '@/components/admin/audit/filters/AuditToolbar'
import { auditFilterCodec } from '@/components/admin/audit/filters/audit-filters'
import { AuditEmpty } from '@/components/admin/audit/table/AuditEmpty'
import { AuditTable, AuditTableError, AuditTableSkeleton } from '@/components/admin/audit/table/AuditTable'
import { PagedList } from '@/components/common/list/PagedList'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useListFilters } from '@/hooks/useListFilters'

export default function AuditLogs() {
  const { filters, hasFilters, setFilters, setPage, clearFilters } = useListFilters(auditFilterCodec)
  const [clearedAt, setClearedAt] = useState(readClearedAt)
  const list = auditListQuery(filters, clearedAt)
  const entries = useApiQuery(list.key, list.load, { keepPreviousData: true })

  const changeClearedAt = (value: string | null) => {
    saveClearedAt(value)
    setClearedAt(value)
    if (filters.page > 1) setPage(1)
  }

  const targetLabel =
    entries.status === 'success'
      ? entries.data.items.find((entry) => entry.targetId === filters.target)?.targetLabel
      : undefined

  const hrefFor = (page: number) => `?${auditFilterCodec.toSearchParams({ ...filters, page })}`

  return (
    <AdminWrap>
      <section aria-labelledby="audit-title">
        <SectionHeader
          id="audit-title"
          as="h1"
          title="Audit logs"
        />

        <div className="flex flex-col gap-6">
          <AuditToolbar
            filters={filters}
            canClear={hasFilters}
            targetLabel={targetLabel}
            clearedAt={clearedAt}
            onChange={setFilters}
            onClearFilters={clearFilters}
            onClearLog={() => changeClearedAt(new Date().toISOString())}
            onRestoreLog={() => changeClearedAt(null)}
          />

          {entries.status === 'loading' && <AuditTableSkeleton />}

          {entries.status === 'error' && <AuditTableError error={entries.error} onRetry={entries.reload} />}

          {entries.status === 'success' && (
            <PagedList page={filters.page} result={entries.data} hrefFor={hrefFor} onPageChange={setPage}>
              <AuditTable
                entries={entries.data.items}
                stale={entries.stale}
                empty={
                  <AuditEmpty
                    filtered={hasFilters}
                    clearedAt={clearedAt}
                    onRestoreLog={() => changeClearedAt(null)}
                  />
                }
                onTargetSelect={(target) => setFilters({ target })}
              />
            </PagedList>
          )}
        </div>
      </section>
    </AdminWrap>
  )
}