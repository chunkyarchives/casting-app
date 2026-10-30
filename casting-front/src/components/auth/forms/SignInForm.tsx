import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { FieldError, FieldGroup, FieldSeparator } from '@/components/ui/field'
import { signInSchema, type SignInValues } from '@/lib/validation/auth'
import { authErrorMessage } from './auth-errors'
import { useCurrentParticipant } from '../useCurrentParticipant'
import { useGoToRoleHome } from '../hooks/useGoToRoleHome'
import { useSignIn } from '../hooks/useSignIn'
import { AuthTextField } from './AuthTextField'
import { signInFormId } from './form-ids'

type Props = {
  onPendingChange: (pending: boolean) => void
  onSuccess: () => void
}

export function SignInForm({ onPendingChange, onSuccess }: Props) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  })

  const signIn = useSignIn()
  const participant = useCurrentParticipant()
  const goToRoleHome = useGoToRoleHome()

  const onSubmit = async (values: SignInValues) => {
    onPendingChange(true)
    try {
      await signIn(values)
      onSuccess()
    } catch (error) {
      setError('root.server', { message: authErrorMessage(error) })
    }
    onPendingChange(false)
  }

  const continueAsParticipant = () => {
    if (!participant) return
    goToRoleHome(participant.role)
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