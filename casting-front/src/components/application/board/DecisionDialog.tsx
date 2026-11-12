import { useState } from 'react'
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
import { toast } from '@/components/ui/toast'
import { applicationsApi } from '@/lib/api/applications'
import { apiErrorMessage } from '@/lib/api/errors'
import type { RoleApplication } from '@/types/application'
import { decisionButtonClass, type Decision } from './strip-styles'

const copy: Record<Decision, { action: string; pending: string; description: string }> = {
  accept: {
    action: 'Accept',
    pending: 'Accepting…',
    description: "The role is filled and every other application for it is declined. This can't be undone.",
  },
  reject: {
    action: 'Reject',
    pending: 'Rejecting…',
    description: 'The actor is told the application was declined and can apply for this role again.',
  },
}

type Props = {
  application: RoleApplication
  decision: Decision | null
  onClose: () => void
  onDecided: (decision: Decision) => void
  onFailed: () => void
}

export function DecisionDialog({ application, decision, onClose, onDecided, onFailed }: Props) {
  const [pending, setPending] = useState(false)
  const [shown, setShown] = useState<Decision>(decision ?? 'accept')
  if (decision !== null && decision !== shown) setShown(decision)
  const text = copy[shown]

  const confirm = async () => {
    setPending(true)
    const request = shown === 'accept' ? applicationsApi.accept : applicationsApi.reject
    const decided = await request(application.id).then(
      () => true,
      (error: unknown) => {
        toast.add({ type: 'error', title: `${text.action} failed`, description: apiErrorMessage(error) })
        return false
      },
    )
    setPending(false)
    onClose()
    if (decided) onDecided(shown)
    else onFailed()
  }

  return (
    <AlertDialog open={decision !== null} onOpenChange={(open) => !open && !pending && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {text.action} {application.actorName} for {application.filmRoleName}?
          </AlertDialogTitle>
          <AlertDialogDescription>{text.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Not yet</AlertDialogCancel>
          <Button disabled={pending} className={decisionButtonClass[shown]} onClick={() => void confirm()}>
            {pending ? text.pending : text.action}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}