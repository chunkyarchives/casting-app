import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FieldGroup, FieldSeparator } from '@/components/ui/field'
import { signInSchema, type SignInValues } from '@/lib/validation/auth'
import type { SignInRequest } from '@/types/participant'
import { AuthTextField } from './AuthTextField'
import { signInFormId } from './form-ids'
import { useCurrentParticipant } from '../useCurrentParticipant'

export function SignInForm() {
  const { control, handleSubmit } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  })

  const onSubmit = (values: SignInValues) => {
    const payload: SignInRequest = values
    if (import.meta.env.DEV) console.table(payload)
  }

  const participant = useCurrentParticipant()

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
          maxLength={128}
        />

        {participant && (
            <>
                <FieldSeparator>or</FieldSeparator>
                {/* "Continue as <avatar> {participant.firstName}" button */}
            </>
        )}

        {/* Reserved: "Continue as <avatar> username" button for an already
            signed-in participant, once auth exists on the backend */}
        <div className="min-h-20" />
      </FieldGroup>
    </form>
  )
}