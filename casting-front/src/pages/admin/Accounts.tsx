import { useState } from 'react'
import { Navigate } from 'react-router'
import { toast } from 'sonner'
import { AdminWrap } from '@/components/admin/AdminWrap'
import { SectionHeader } from '@/components/admin/SectionHeader'
import { AccountActionDialog, type ActionTarget } from '@/components/admin/accounts/dialog/AccountActionDialog'
import { AccountDetailsSheet } from '@/components/admin/accounts/details/AccountDetailsSheet'
import { AccountFilterGroups } from '@/components/admin/accounts/filters/AccountFilterGroups'
import { AccountSearch } from '@/components/admin/accounts/filters/AccountSearch'
import { AccountsTable } from '@/components/admin/accounts/table/AccountsTable'
import type { AccountAction } from '@/components/admin/accounts/account-actions'
import {
  accountsPageSize,
  toAccountListQuery,
  toSearchParams,
} from '@/components/admin/accounts/filters/account-filters'
import { useAccountFilters } from '@/components/admin/accounts/hooks/useAccountFilters'
import { ListPagination } from '@/components/common/ListPagination'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery'
import { adminApi } from '@/lib/api/admin'
import { apiErrorMessage } from '@/lib/api/errors'
import { formatCount } from '@/lib/format'
import type { AdminAccount } from '@/types/admin'

type Overlay<T> = { open: boolean; value: T }

export default function Accounts() {
  const { filters, setFilters, setPage, clearFilters } = useAccountFilters()
  const query = toAccountListQuery(filters)
  const accounts = useApiQuery(`admin-accounts-${JSON.stringify(query)}`, () => adminApi.listAccounts(query), {
    keepPreviousData: true,
  })

  const [details, setDetails] = useState<Overlay<AdminAccount | null>>({ open: false, value: null })
  const [dialog, setDialog] = useState<Overlay<ActionTarget | null>>({ open: false, value: null })
  const [detailsRevision, setDetailsRevision] = useState(0)

  const handleAction = (action: AccountAction, account: AdminAccount) => {
    if (action === 'details') setDetails({ open: true, value: account })
    else setDialog({ open: true, value: { action, account } })
  }

  const handleDone = (message: string) => {
    toast.success(message)
    setDialog((current) => ({ ...current, open: false }))
    accounts.reload()
    if (dialog.value?.action === 'delete') setDetails((current) => ({ ...current, open: false }))
    else setDetailsRevision((revision) => revision + 1)
  }

  const hrefFor = (page: number) => `?${toSearchParams({ ...filters, page })}`

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
          <AccountSearch value={filters.search} onChange={(search) => setFilters({ search }, { replace: true })} />
          <AccountFilterGroups filters={filters} onChange={setFilters} onClear={clearFilters} />

          {accounts.status === 'loading' && <Skeleton className="h-96 w-full" />}

          {accounts.status === 'error' && (
            <Alert variant="destructive">
              <AlertTitle>Accounts could not be loaded</AlertTitle>
              <AlertDescription>{apiErrorMessage(accounts.error)}</AlertDescription>
            </Alert>
          )}

          {accounts.status === 'success' && (
            <AccountsResult
              accounts={accounts.data.items}
              totalCount={accounts.data.totalCount}
              page={filters.page}
              stale={accounts.stale}
              hrefFor={hrefFor}
              onPageChange={setPage}
              onAction={handleAction}
            />
          )}
        </div>
      </section>

      <AccountDetailsSheet
        account={details.value}
        open={details.open}
        onOpenChange={(open) => setDetails((current) => ({ ...current, open }))}
        revision={detailsRevision}
        onAction={handleAction}
      />
      <AccountActionDialog
        target={dialog.value}
        open={dialog.open}
        onOpenChange={(open) => setDialog((current) => ({ ...current, open }))}
        onDone={handleDone}
      />
    </AdminWrap>
  )
}

type AccountsResultProps = {
  accounts: AdminAccount[]
  totalCount: number
  page: number
  stale: boolean
  hrefFor: (page: number) => string
  onPageChange: (page: number) => void
  onAction: (action: AccountAction, account: AdminAccount) => void
}

function AccountsResult({ accounts, totalCount, page, stale, hrefFor, onPageChange, onAction }: AccountsResultProps) {
  const pageCount = Math.max(1, Math.ceil(totalCount / accountsPageSize))

  if (page > pageCount) return <Navigate to={hrefFor(pageCount)} replace />

  const first = (page - 1) * accountsPageSize + 1
  const last = first + accounts.length - 1

  return (
    <>
      <AccountsTable accounts={accounts} stale={stale} onAction={onAction} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground tabular-nums">
          {totalCount > 0 && `${formatCount(first)}–${formatCount(last)} of ${formatCount(totalCount)}`}
        </p>
        <ListPagination page={page} pageCount={pageCount} hrefFor={hrefFor} onPageChange={onPageChange} />
      </div>
    </>
  )
}