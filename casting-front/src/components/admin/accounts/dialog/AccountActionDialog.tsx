import { useState } from 'react'
import { describeAccountAction, type ConfirmedAction } from '@/components/admin/accounts/account-actions'
import { ReasonForm } from '@/components/admin/ReasonDialog'
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog'
import type { AdminAccount } from '@/types/admin'
import { defaultLockUntil, lockEnd, validateLockUntil, type LockUntil } from './lock-until'
import { LockUntilField } from './LockUntilField'

export type ActionTarget = {
  action: ConfirmedAction
  account: AdminAccount
}

type Props = {
  target: ActionTarget | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDone: (message: string) => void
}

export function AccountActionDialog({ target, open, onOpenChange, onDone }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        {target && <AccountActionForm target={target} onCancel={() => onOpenChange(false)} onDone={onDone} />}
      </AlertDialogContent>
    </AlertDialog>
  )
}

type AccountActionFormProps = {
  target: ActionTarget
  onCancel: () => void
  onDone: (message: string) => void
}

function AccountActionForm({ target: { action, account }, onCancel, onDone }: AccountActionFormProps) {
  const [lockUntil, setLockUntil] = useState<LockUntil>(defaultLockUntil)
  const locking = action === 'lock'

  return (
    <ReasonForm
      action={describeAccountAction(action, account, lockEnd(lockUntil))}
      extraFields={locking ? <LockUntilField value={lockUntil} onChange={setLockUntil} /> : undefined}
      extraError={locking ? validateLockUntil(lockUntil) : null}
      onCancel={onCancel}
      onDone={onDone}
    />
  )
}