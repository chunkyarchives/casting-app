import { zodResolver } from '@hookform/resolvers/zod'
import { format, parseISO } from 'date-fns'
import { Controller, useForm } from 'react-hook-form'
import { AuthTextField } from '@/components/auth/forms/AuthTextField'
import { useSession } from '@/components/auth/session/session-context'
import { DatePicker } from '@/components/common/form/DatePicker'
import { showServerErrors } from '@/components/profile/form/profile-form'
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
import { toast } from '@/components/ui/toast'
import { accountApi } from '@/lib/api/accounts'
import { apiErrorMessage } from '@/lib/api/errors'
import { deactivateSchema, deactivationRange, type DeactivateValues } from '@/lib/validation/account'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeactivateDialog({ open, onOpenChange }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <DeactivateForm onCancel={() => onOpenChange(false)} />
      </AlertDialogContent>
    </AlertDialog>
  )
}

function DeactivateForm({ onCancel }: { onCancel: () => void }) {
  const { signOut } = useSession()
  const range = deactivationRange()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DeactivateValues>({
    resolver: zodResolver(deactivateSchema),
    defaultValues: { until: '', password: '' },
    mode: 'onTouched',
  })

  const deactivate = async (values: DeactivateValues) => {
    const day = format(parseISO(values.until), 'd MMMM yyyy')

    try {
      await accountApi.deactivate(values)
      await signOut()
      toast.add({
        type: 'success',
        title: 'Your account is deactivated',
        description: `Your profile stays hidden until ${day}. Sign in any time to bring it back.`,
      })
    } catch (error) {
      if (!showServerErrors(error, setError)) setError('root.server', { message: apiErrorMessage(error) })
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(deactivate)} className="contents">
      <AlertDialogHeader>
        <AlertDialogTitle>Deactivate your account?</AlertDialogTitle>
        <AlertDialogDescription>
          Your profile is hidden and you are signed out everywhere until the day you pick. Sign in earlier and it is
          back right away.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <FieldGroup className="gap-5">
        <Controller
          name="until"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Hidden until</FieldLabel>
              <DatePicker
                label="Hidden until"
                value={field.value || null}
                onChange={field.onChange}
                min={range.first}
                max={range.last}
                defaultMonth={parseISO(range.first)}
                invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
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
          Cancel
        </AlertDialogCancel>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Deactivating…' : 'Deactivate'}
        </Button>
      </AlertDialogFooter>
    </form>
  )
}