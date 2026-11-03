import { fullName, type AccountAction } from '@/components/admin/accounts/account-actions'
import { LoadError } from '@/components/common/states/LoadError'
import { NoResults } from '@/components/common/states/NoResults'
import { SkeletonRows } from '@/components/common/list/SkeletonRows'
import { TableMessageRow } from '@/components/common/list/TableMessageRow'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/format'
import { roleLabels } from '@/lib/roles'
import { cn } from '@/lib/utils'
import type { AdminAccount } from '@/types/admin'
import { AccountActionsMenu } from './AccountActionsMenu'

type Props = {
  accounts: AdminAccount[]
  stale: boolean
  onAction: (action: AccountAction, account: AdminAccount) => void
}

const columnCount = 7

const tableLayout = 'min-w-4xl table-fixed'

export function AccountsTable({ accounts, stale, onAction }: Props) {
  return (
    <Table className={cn(tableLayout, 'transition-opacity', stale && 'opacity-60')} aria-busy={stale}>
      <AccountsHeader />

      <TableBody>
        {accounts.length === 0 ? (
          <TableMessageRow columnCount={columnCount}>
            <NoResults />
          </TableMessageRow>
        ) : (
          accounts.map((account) => (
            <TableRow key={account.id} className="cursor-pointer" onClick={() => onAction('details', account)}>
              <TableCell className="truncate font-medium">{fullName(account)}</TableCell>
              <TableCell className="truncate text-muted-foreground">{account.email}</TableCell>
              <TableCell>{roleLabels[account.role]}</TableCell>
              <TableCell>
                <Badge variant={account.profileComplete ? 'secondary' : 'outline'}>
                  {account.profileComplete ? 'Complete' : 'Incomplete'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={account.locked ? 'destructive' : 'secondary'}>
                  {account.locked ? 'Locked' : 'Active'}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums">{formatDate(account.createdAt)}</TableCell>
              <TableCell className="text-right" onClick={(event) => event.stopPropagation()}>
                <AccountActionsMenu account={account} onSelect={(action) => onAction(action, account)} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

export function AccountsTableSkeleton() {
  return (
    <Table className={tableLayout}>
      <AccountsHeader />
      <SkeletonRows columnCount={columnCount} />
    </Table>
  )
}

export function AccountsTableError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <Table className={tableLayout}>
      <AccountsHeader />
      <TableBody>
        <TableMessageRow columnCount={columnCount}>
          <LoadError title="Accounts could not be loaded" error={error} onRetry={onRetry} />
        </TableMessageRow>
      </TableBody>
    </Table>
  )
}

function AccountsHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead className="w-60">E-mail</TableHead>
        <TableHead className="w-36">Role</TableHead>
        <TableHead className="w-28">Profile</TableHead>
        <TableHead className="w-24">Status</TableHead>
        <TableHead className="w-32">Registered</TableHead>
        <TableHead className="w-14">
          <span className="sr-only">Actions</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  )
}