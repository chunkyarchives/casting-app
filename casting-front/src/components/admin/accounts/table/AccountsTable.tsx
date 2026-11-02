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
import { fullName, type AccountAction } from '../account-actions'
import { AccountActionsMenu } from './AccountActionsMenu'

type Props = {
  accounts: AdminAccount[]
  stale: boolean
  onAction: (action: AccountAction, account: AdminAccount) => void
}

const columnCount = 7

export function AccountsTable({ accounts, stale, onAction }: Props) {
  return (
    <Table className={cn('transition-opacity', stale && 'opacity-60')} aria-busy={stale}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Profile</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Registered</TableHead>
          <TableHead className="w-12">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {accounts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columnCount} className="h-24 text-center text-muted-foreground">
              No accounts match the search and filters.
            </TableCell>
          </TableRow>
        ) : (
          accounts.map((account) => (
            <TableRow key={account.id} className="cursor-pointer" onClick={() => onAction('details', account)}>
              <TableCell className="font-medium">{fullName(account)}</TableCell>
              <TableCell className="text-muted-foreground">{account.email}</TableCell>
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