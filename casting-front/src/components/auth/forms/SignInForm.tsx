import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { FieldError, FieldGroup, FieldSeparator } from '@/components/ui/field'
import { roleHomePath } from '@/lib/routes'
import { signInSchema, type SignInValues } from '@/lib/validation/auth'
import { useCurrentParticipant } from '../useCurrentParticipant'
import { signInErrorMessage, useSignIn } from '../useSignIn'
import { AuthTextField } from './AuthTextField'
import { signInFormId } from './form-ids'

type Props = {
  onPendingChange: (pending: boolean) => void
  onSuccess: () => void
}

export function SignInForm({ onPendingChange, onSuccess }: Props) {
  const { control, handleSubmit, setError, formState: { errors }} = useForm<SignInValues>(
  {
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched'
  })

  const signIn = useSignIn()
  const participant = useCurrentParticipant()
  const navigate = useNavigate()

  const onSubmit = async (values: SignInValues) => {
    onPendingChange(true)
    try {
      await signIn(values)
      onSuccess()
    } catch (error) {
      setError('root.server', { message: signInErrorMessage(error) })
    } finally {
      onPendingChange(false)
    }
  }

  const continueAsParticipant = () => {
    if (!participant) return
    navigate(roleHomePath(participant.role))
    onSuccess()
  }

  return (
    <form id={signInFormId} noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <AuthTextField
          control={control}
          name="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          maxLength={254}
        />
        <AuthTextField
          control={control}
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          maxLength={100}
        />

        <FieldError>{errors.root?.server?.message}</FieldError>

        {participant && (
          <>
            <FieldSeparator>or</FieldSeparator>
            {/* TODO: avatar from participant.profilePictureUrl */}
            <Button type="button" variant="outline" onClick={continueAsParticipant}>
              Continue as {participant.firstName}
            </Button>
          </>
        )}

        <div className="min-h-20" />
      </FieldGroup>
    </form>
  )
}