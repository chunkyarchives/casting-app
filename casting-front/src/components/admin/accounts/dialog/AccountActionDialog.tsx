import { useId, useState, type FormEvent } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { apiErrorMessage } from '@/lib/api/errors'
import type { AdminAccount } from '@/types/admin'
import { accountActions, fullName, type ConfirmedAction } from '../account-actions'
import { defaultLockUntil, lockEnd, LockUntilField, type LockUntil } from './LockUntilField'

const minReasonLength = 3
const maxReasonLength = 500

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
        {target && (
          <ActionForm
            key={`${target.action}-${target.account.id}`}
            target={target}
            onCancel={() => onOpenChange(false)}
            onDone={onDone}
          />
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}

type ActionFormProps = {
  target: ActionTarget
  onCancel: () => void
  onDone: (message: string) => void
}

function ActionForm({ target: { action, account }, onCancel, onDone }: ActionFormProps) {
  const definition = accountActions[action]
  const reasonId = useId()

  const [reason, setReason] = useState('')
  const [lockUntil, setLockUntil] = useState<LockUntil>(defaultLockUntil)
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const reasonError =
    definition.reasonRequired && reason.trim().length < minReasonLength
      ? `Enter a reason of at least ${minReasonLength} characters.`
      : null
  const lockError = action === 'lock' ? validateLockUntil(lockUntil) : null

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (reasonError || lockError) return

    setPending(true)
    setServerError(null)
    try {
      const message = await definition.run(account, {
        reason: reason.trim(),
        lockUntil: lockEnd(lockUntil),
      })
      onDone(message)
    } catch (error) {
      setServerError(apiErrorMessage(error))
    }
    setPending(false)
  }

  return (
    <form noValidate onSubmit={submit} className="contents">
      <AlertDialogHeader>
        <AlertDialogTitle>{definition.title(fullName(account))}</AlertDialogTitle>
        <AlertDialogDescription>{definition.description}</AlertDialogDescription>
      </AlertDialogHeader>

      <FieldGroup className="gap-5">
        {action === 'lock' && (
          <div className="flex flex-col gap-2">
            <LockUntilField value={lockUntil} onChange={setLockUntil} />
            {submitted && <FieldError>{lockError}</FieldError>}
          </div>
        )}

        <Field data-invalid={submitted && reasonError !== null}>
          <FieldLabel htmlFor={reasonId}>
            Reason{!definition.reasonRequired && <span className="text-muted-foreground"> (optional)</span>}
          </FieldLabel>
          <Textarea
            id={reasonId}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            maxLength={maxReasonLength}
            placeholder="Saved in the audit log"
            aria-invalid={submitted && reasonError !== null}
          />
          {submitted && <FieldError>{reasonError}</FieldError>}
        </Field>
      </FieldGroup>

      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <AlertDialogFooter>
        <AlertDialogCancel disabled={pending} onClick={onCancel}>
          Cancel
        </AlertDialogCancel>
        <Button type="submit" variant={definition.destructive ? 'destructive' : 'default'} disabled={pending}>
          {pending ? definition.pendingLabel : definition.confirmLabel}
        </Button>
      </AlertDialogFooter>
    </form>
  )
}

function validateLockUntil(lockUntil: LockUntil): string | null {
  if (lockUntil.kind === 'untilUnlocked') return null
  if (!lockUntil.date) return 'Pick the day the lock ends.'

  const end = lockEnd(lockUntil)
  return end && end > new Date() ? null : 'The lock has to end in the future.'
}