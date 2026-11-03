import { useState } from 'react'
import { toast } from '@/components/ui/toast'
import { AdminWrap } from '@/components/admin/AdminWrap'
import { SectionHeader } from '@/components/admin/SectionHeader'
import type { AccountAction } from '@/components/admin/accounts/account-actions'
import { AccountDetailsSheet } from '@/components/admin/accounts/details/AccountDetailsSheet'
import { AccountActionDialog, type ActionTarget } from '@/components/admin/accounts/dialog/AccountActionDialog'
import { AccountFilterGroups } from '@/components/admin/accounts/filters/AccountFilterGroups'
import { accountFilterCodec } from '@/components/admin/accounts/filters/account-filters'
import { accountsListQuery } from '@/components/admin/accounts/accounts-list'
import { AccountsTable, AccountsTableError, AccountsTableSkeleton } from '@/components/admin/accounts/table/AccountsTable'
import { PagedList } from '@/components/common/list/PagedList'
import { SearchField } from '@/components/common/list/SearchField'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useListFilters } from '@/hooks/useListFilters'
import { useOverlay } from '@/hooks/useOverlay'
import { formatCount } from '@/lib/format'
import type { AdminAccount } from '@/types/admin'

export default function Accounts() {
  const { filters, setFilters, setPage, clearFilters } = useListFilters(accountFilterCodec)
  const list = accountsListQuery(filters)
  const accounts = useApiQuery(list.key, list.load, { keepPreviousData: true })

  const details = useOverlay<AdminAccount>()
  const dialog = useOverlay<ActionTarget>()

  const [revision, setRevision] = useState(0)

  const handleAction = (action: AccountAction, account: AdminAccount) => {
    if (action === 'details') details.show(account)
    else dialog.show({ action, account })
  }

  const handleDone = (message: string) => {
    toast.add({ title: message, type: 'success' })
    dialog.setOpen(false)
    accounts.reload()

    if (dialog.value?.action === 'delete') details.setOpen(false)
    else setRevision((current) => current + 1)
  }

  const hrefFor = (page: number) => `?${accountFilterCodec.toSearchParams({ ...filters, page })}`

  return (
    <AdminWrap>
      <section aria-labelledby="accounts-title">
        <SectionHeader
          id="accounts-title"
          as="h1"
          title="Accounts"
          aside={accounts.status === 'success' ? formatCount(accounts.data.totalCount) : undefined}
        />

        <div className="flex flex-col gap-6">
          <SearchField
            value={filters.search}
            onChange={(search) => setFilters({ search }, { replace: true })}
            placeholder="Search by name or e-mail"
            label="Search accounts"
          />
          <AccountFilterGroups filters={filters} onChange={setFilters} onClear={clearFilters} />

          {accounts.status === 'loading' && <AccountsTableSkeleton />}

          {accounts.status === 'error' && <AccountsTableError error={accounts.error} onRetry={accounts.reload} />}

          {accounts.status === 'success' && (
            <PagedList page={filters.page} result={accounts.data} hrefFor={hrefFor} onPageChange={setPage}>
              <AccountsTable accounts={accounts.data.items} stale={accounts.stale} onAction={handleAction} />
            </PagedList>
          )}
        </div>
      </section>

      <AccountDetailsSheet
        account={details.value}
        open={details.open}
        onOpenChange={details.setOpen}
        revision={revision}
        onAction={handleAction}
      />
      <AccountActionDialog
        target={dialog.value}
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        onDone={handleDone}
      />
    </AdminWrap>
  )
}