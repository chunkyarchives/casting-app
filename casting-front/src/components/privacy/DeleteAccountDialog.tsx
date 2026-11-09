import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AuthTextField } from '@/components/auth/forms/AuthTextField'
import { useSession } from '@/components/auth/session/session-context'
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
import { FieldGroup } from '@/components/ui/field'
import { toast } from '@/components/ui/toast'
import { accountApi } from '@/lib/api/accounts'
import { apiErrorMessage } from '@/lib/api/errors'
import { deleteAccountSchema, type DeleteAccountValues } from '@/lib/validation/account'
import type { ParticipantRole } from '@/types/participant'

const deleteNotes: Partial<Record<ParticipantRole, string>> = {
  Actor: 'Your profile, photos, showreels and applications are removed for good.',
  Director: 'Your profile and crew are removed for good. Delete your films first.',
  CastingDirector: 'Your profile and crew memberships are removed for good.',
}

type Props = {
  role: ParticipantRole
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAccountDialog({ role, open, onOpenChange }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <DeleteAccountForm note={deleteNotes[role]} onCancel={() => onOpenChange(false)} />
      </AlertDialogContent>
    </AlertDialog>
  )
}

function DeleteAccountForm({ note, onCancel }: { note?: string; onCancel: () => void }) {
  const { signOut } = useSession()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DeleteAccountValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: '' },
    mode: 'onTouched',
  })

  const remove = async (values: DeleteAccountValues) => {
    try {
      await accountApi.remove(values)
      await signOut()
      toast.add({ type: 'success', title: 'Your account was deleted' })
    } catch (error) {
      setError('root.server', { message: apiErrorMessage(error) })
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(remove)} className="contents">
      <AlertDialogHeader>
        <AlertDialogTitle>Delete your account?</AlertDialogTitle>
        <AlertDialogDescription>{note} This can't be undone.</AlertDialogDescription>
      </AlertDialogHeader>

      <FieldGroup>
        <AuthTextField
          control={control}
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          maxLength={100}
        />
      </FieldGroup>

      {errors.root?.server && (
        <Alert variant="destructive">
          <AlertDescription>{errors.root.server.message}</AlertDescription>
        </Alert>
      )}

      <AlertDialogFooter>
        <AlertDialogCancel disabled={isSubmitting} onClick={onCancel}>
          Keep my account
        </AlertDialogCancel>
        <Button type="submit" variant="destructive" disabled={isSubmitting}>
          {isSubmitting ? 'Deleting…' : 'Delete account'}
        </Button>
      </AlertDialogFooter>
    </form>
  )
}