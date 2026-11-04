import { useState } from 'react'
import { AdminWrap } from '@/components/admin/AdminWrap'
import { ReasonDialog } from '@/components/admin/ReasonDialog'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { CrewSheet } from '@/components/admin/productions/crew/CrewSheet'
import { FilmSheet } from '@/components/admin/productions/film/FilmSheet'
import { CrewToolbar } from '@/components/admin/productions/filters/CrewToolbar'
import { crewFilterCodec } from '@/components/admin/productions/filters/crew-filters'
import { describeAction, type ProductionAction } from '@/components/admin/productions/production-actions'
import { productionsListQuery, type ProductionRow } from '@/components/admin/productions/production-rows'
import { CrewsTable, CrewsTableError, CrewsTableSkeleton } from '@/components/admin/productions/table/CrewsTable'
import { PagedList } from '@/components/common/list/PagedList'
import { toast } from '@/components/ui/toast'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useListFilters } from '@/hooks/useListFilters'
import { useOverlay } from '@/hooks/useOverlay'
import { formatCount } from '@/lib/format'
import type { AdminFilm } from '@/types/admin'

export default function Productions() {
  const { filters, hasFilters, setFilters, setPage, clearFilters } = useListFilters(crewFilterCodec)
  const list = productionsListQuery(filters)
  const rows = useApiQuery(list.key, list.load, { keepPreviousData: true })

  const crewSheet = useOverlay<ProductionRow>()
  const filmSheet = useOverlay<AdminFilm>()
  const dialog = useOverlay<ProductionAction>()
  const [revision, setRevision] = useState(0)

  const handleDone = (message: string) => {
    toast.add({ title: message, type: 'success' })
    dialog.setOpen(false)
    rows.reload()

    if (dialog.value?.kind === 'deleteCrew') crewSheet.setOpen(false)
    else setRevision((current) => current + 1)

    if (dialog.value?.kind === 'deleteFilm') filmSheet.setOpen(false)
  }

  const hrefFor = (page: number) => `?${crewFilterCodec.toSearchParams({ ...filters, page })}`

  return (
    <AdminWrap>
      <section aria-labelledby="productions-title">
        <SectionHeader
          id="productions-title"
          as="h1"
          title="Productions"
          aside={rows.status === 'success' ? formatCount(rows.data.totalCount) : undefined}
        />

        <div className="flex flex-col gap-6">
          <CrewToolbar filters={filters} canClear={hasFilters} onChange={setFilters} onClear={clearFilters} />

          {rows.status === 'loading' && <CrewsTableSkeleton />}

          {rows.status === 'error' && <CrewsTableError error={rows.error} onRetry={rows.reload} />}

          {rows.status === 'success' && (
            <PagedList page={filters.page} result={rows.data} hrefFor={hrefFor} onPageChange={setPage}>
              <CrewsTable
                rows={rows.data.items}
                stale={rows.stale}
                revision={revision}
                onOpenRow={crewSheet.show}
                onOpenFilm={filmSheet.show}
              />
            </PagedList>
          )}
        </div>
      </section>

      <CrewSheet
        row={crewSheet.value}
        open={crewSheet.open}
        onOpenChange={crewSheet.setOpen}
        revision={revision}
        onAction={dialog.show}
      />
      <FilmSheet film={filmSheet.value} open={filmSheet.open} onOpenChange={filmSheet.setOpen} onAction={dialog.show} />
      <ReasonDialog
        action={dialog.value && describeAction(dialog.value)}
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        onDone={handleDone}
      />
    </AdminWrap>
  )
}