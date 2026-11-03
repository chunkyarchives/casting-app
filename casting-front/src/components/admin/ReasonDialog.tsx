import { useId, useState, type SubmitEvent, type ReactNode } from 'react'
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

const minReasonLength = 3
const maxReasonLength = 500

export type ReasonAction = {
  title: string
  description: string
  confirmLabel: string
  pendingLabel: string
  reasonRequired: boolean
  destructive: boolean
  run: (reason: string) => Promise<string>
}

type ReasonDialogProps = {
  action: ReasonAction | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDone: (message: string) => void
}

export function ReasonDialog({ action, open, onOpenChange, onDone }: ReasonDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        {action && <ReasonForm action={action} onCancel={() => onOpenChange(false)} onDone={onDone} />}
      </AlertDialogContent>
    </AlertDialog>
  )
}

type ReasonFormProps = {
  action: ReasonAction
  extraFields?: ReactNode
  extraError?: string | null
  onCancel: () => void
  onDone: (message: string) => void
}

export function ReasonForm({ action, extraFields, extraError = null, onCancel, onDone }: ReasonFormProps) {
  const reasonId = useId()

  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const reasonError =
    action.reasonRequired && reason.trim().length < minReasonLength
      ? `Enter a reason of at least ${minReasonLength} characters.`
      : null

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
    if (reasonError || extraError) return

    setPending(true)
    setServerError(null)
    try {
      onDone(await action.run(reason.trim()))
    } catch (error) {
      setServerError(apiErrorMessage(error))
    }
    setPending(false)
  }

  return (
    <form noValidate onSubmit={submit} className="contents">
      <AlertDialogHeader>
        <AlertDialogTitle>{action.title}</AlertDialogTitle>
        <AlertDialogDescription>{action.description}</AlertDialogDescription>
      </AlertDialogHeader>

      <FieldGroup className="gap-5">
        {extraFields && (
          <div className="flex flex-col gap-2">
            {extraFields}
            {submitted && <FieldError>{extraError}</FieldError>}
          </div>
        )}

        <Field data-invalid={submitted && reasonError !== null}>
          <FieldLabel htmlFor={reasonId}>
            Reason{!action.reasonRequired && <span className="text-muted-foreground"> (optional)</span>}
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
        <Button type="submit" variant={action.destructive ? 'destructive' : 'default'} disabled={pending}>
          {pending ? action.pendingLabel : action.confirmLabel}
        </Button>
      </AlertDialogFooter>
    </form>
  )
}