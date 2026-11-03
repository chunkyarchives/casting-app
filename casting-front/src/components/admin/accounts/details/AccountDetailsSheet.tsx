import type { ReactNode } from 'react'
import { Delete02Icon, Logout01Icon, SquareLock02Icon, SquareUnlock02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { fullName, type ConfirmedAction } from '@/components/admin/accounts/account-actions'
import { ByteSizeValue } from '@/components/common/ByteSizeValue'
import { CloseProfileAvatar } from '@/components/common/CloseProfileAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery'
import { adminApi } from '@/lib/api/admin'
import { apiErrorMessage } from '@/lib/api/errors'
import { formatCount, formatDate, formatDateTime } from '@/lib/format'
import { roleLabels } from '@/lib/roles'
import { cn } from '@/lib/utils'
import type { AdminAccount, AdminAccountDetail } from '@/types/admin'

type Props = {
  account: AdminAccount | null
  open: boolean
  onOpenChange: (open: boolean) => void
  revision: number
  onAction: (action: ConfirmedAction, account: AdminAccount) => void
}

export function AccountDetailsSheet({ account, open, onOpenChange, revision, onAction }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {account && <AccountDetails key={account.id} account={account} revision={revision} onAction={onAction} />}
      </SheetContent>
    </Sheet>
  )
}

type AccountDetailsProps = Pick<Props, 'revision' | 'onAction'> & {
  account: AdminAccount
}

function AccountDetails({ account, revision, onAction }: AccountDetailsProps) {
  const details = useApiQuery(
    `admin-account-${account.id}-${revision}`,
    () => adminApi.getAccount(account.id),
    { keepPreviousData: true },
  )
  const name = fullName(account)

  return (
    <>
      <SheetHeader className="flex-row items-center gap-4 pr-12">
        {details.status === 'loading' ? (
          <Skeleton className="size-14 shrink-0 rounded-full" />
        ) : (
          <CloseProfileAvatar participantId={account.id} name={name} className="size-14" />
        )}
        <div className="flex min-w-0 flex-col gap-0.5">
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription className="truncate">{account.email}</SheetDescription>
        </div>
      </SheetHeader>

      {details.status === 'loading' && <Skeleton className="mx-4 h-96" />}
      {details.status === 'error' && (
        <p className="px-4 text-sm text-destructive">{apiErrorMessage(details.error)}</p>
      )}
      {details.status === 'success' && (
        <>
          <DetailGroups account={details.data} />
          <AccountActionButtons account={details.data} onAction={onAction} />
        </>
      )}
    </>
  )
}

function DetailGroups({ account }: { account: AdminAccountDetail }) {
  return (
    <div className="flex flex-col gap-6 px-4 pb-6">
      <DetailGroup title="Account">
        <DetailRow label="Role">{roleLabels[account.role]}</DetailRow>
        <DetailRow label="Registered">{formatDateTime(account.createdAt)}</DetailRow>
        <DetailRow label="Profile">
          {account.profileCompletedAt ? `Completed ${formatDate(account.profileCompletedAt)}` : 'Incomplete'}
        </DetailRow>
      </DetailGroup>

      <Separator />

      <DetailGroup title="Status">
        <DetailRow label="Status">
          <Badge variant={account.locked ? 'destructive' : 'secondary'}>
            {account.locked ? 'Locked' : 'Active'}
          </Badge>
        </DetailRow>
        {account.locked && (
          <>
            <DetailRow label="Locked until">
              {account.lockedUntil ? formatDateTime(account.lockedUntil) : 'Until an admin unlocks it'}
            </DetailRow>
            <DetailRow label="Reason" stacked>{account.lockReason ?? '—'}</DetailRow>
          </>
        )}
      </DetailGroup>

      <Separator />

      <DetailGroup title="Activity">
        <DetailRow label="Last active">
          {account.lastActiveAt ? formatDateTime(account.lastActiveAt) : 'Never signed in'}
        </DetailRow>
        <DetailRow label="Active sessions">{formatCount(account.activeSessions)}</DetailRow>
      </DetailGroup>

      <Separator />

      <DetailGroup title="Content">
        <DetailRow label="Films">{formatCount(account.films)}</DetailRow>
        <DetailRow label="Applications">{formatCount(account.applications)}</DetailRow>
        <DetailRow label="Conversations">{formatCount(account.conversations)}</DetailRow>
        <DetailRow label="Files">{formatCount(account.mediaFiles)}</DetailRow>
        <DetailRow label="Files size">
          <ByteSizeValue bytes={account.mediaBytes} unit="MB" />
        </DetailRow>
      </DetailGroup>
    </div>
  )
}

type AccountActionButtonsProps = Pick<Props, 'onAction'> & {
  account: AdminAccountDetail
}

function AccountActionButtons({ account, onAction }: AccountActionButtonsProps) {
  const manageable = account.role !== 'Admin'

  return (
    <SheetFooter>
      <Button variant="outline" disabled={!manageable} onClick={() => onAction('forceLogout', account)}>
        <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
        Force logout
      </Button>
      {account.locked ? (
        <Button variant="outline" disabled={!manageable} onClick={() => onAction('unlock', account)}>
          <HugeiconsIcon icon={SquareUnlock02Icon} strokeWidth={2} />
          Unlock
        </Button>
      ) : (
        <Button variant="destructive" disabled={!manageable} onClick={() => onAction('lock', account)}>
          <HugeiconsIcon icon={SquareLock02Icon} strokeWidth={2} />
          Lock
        </Button>
      )}
      <Button variant="destructive" disabled={!manageable} onClick={() => onAction('delete', account)}>
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
        Delete account
      </Button>
    </SheetFooter>
  )
}

function DetailGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 text-sm">
      <h3 className="font-medium">{title}</h3>
      <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2">{children}</dl>
    </section>
  )
}

type DetailRowProps = {
  label: string
  stacked?: boolean
  children: ReactNode
}

function DetailRow({ label, stacked, children }: DetailRowProps) {
  return (
    <>
      <dt className={cn('text-muted-foreground', stacked && 'col-span-2')}>{label}</dt>
      <dd className={cn(stacked ? 'col-span-2 whitespace-pre-line' : 'text-right')}>{children}</dd>
    </>
  )
}