import { useState } from 'react'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { SettingsRow } from '@/components/settings/SettingsRow'
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
import { apiErrorMessage } from '@/lib/api/errors'

type Props = {
  label: string
  hint: string
  title: string
  description: string
  onDelete: () => Promise<void>
}

export function DeleteRow({ label, hint, title, description, onDelete }: Props) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  const confirm = async () => {
    setPending(true)
    try {
      await onDelete()
    } catch (error) {
      toast.add({ type: 'error', title: `${label} failed`, description: apiErrorMessage(error) })
    }
    setPending(false)
  }

  return (
    <SettingsRow label={label} hint={hint}>
      <Button type="button" variant="destructive" onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} data-icon="inline-start" />
        {label}
      </Button>

      <AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Keep it</AlertDialogCancel>
            <Button variant="destructive" disabled={pending} onClick={() => void confirm()}>
              {pending ? 'Deleting…' : label}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SettingsRow>
  )
}