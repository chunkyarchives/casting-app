import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import {
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Separator } from '@/components/ui/separator'
import { signUpSchema, splitFullName, type SignUpValues } from '@/lib/validation/auth'
import { cn } from '@/lib/utils'
import type { SignUpRequest, SignUpRole } from '@/types/participant'
import { AuthTextField } from './AuthTextField'
import { signUpFormId } from './form-ids'

const roleOptions: { value: SignUpRole; label: string; description: string }[] = [
  {
    value: 'Actor',
    label: 'Actor',
    description: 'Build your profile and get matched to film roles.',
  },
  {
    value: 'Director',
    label: 'Director',
    description: 'Create films, open roles and make the final casting decisions.',
  },
  {
    value: 'CastingDirector',
    label: 'Casting Director',
    description: "Join a director's crew and match actors to roles.",
  },
]

export function SignUpForm() {
  const { control, handleSubmit } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: '', username: '', email: '', password: '', confirmPassword: '' },
    mode: 'onTouched',
  })

  const onSubmit = ({ fullName, username, email, password, role }: SignUpValues) => {
    const { firstName, lastName } = splitFullName(fullName)
    const payload: SignUpRequest = {
      firstName,
      lastName,
      username,
      email: email.toLowerCase(),
      password,
      role,
    }
    if (import.meta.env.DEV) console.table(payload)
  }

  return (
    <form id={signUpFormId} noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <AuthTextField
          control={control}
          name="fullName"
          label="Full name"
          autoComplete="name"
          placeholder="Dale Cooper"
          maxLength={100}
        />
        <AuthTextField
          control={control}
          name="username"
          label="Username"
          autoComplete="username"
          maxLength={30}
        />
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
          autoComplete="new-password"
          maxLength={100}
        />
        <AuthTextField
          control={control}
          name="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          maxLength={100}
        />

        <Separator />

        <Controller
            name="role"
            control={control}
            render={({ field, fieldState }) => {
                const selected = roleOptions.find((option) => option.value === field.value)

                return (
                <FieldSet data-invalid={fieldState.invalid}>
                  <FieldLegend variant="label" className="w-full text-center">Join as</FieldLegend>
                    <div
                    className={cn(
                        'grid grid-cols-[1fr_1fr_1.35fr] gap-1 rounded-full bg-muted p-0.75',
                        fieldState.invalid && 'ring-1 ring-destructive',
                    )}
                    >
                    {roleOptions.map(({ value, label }) => (
                        <label
                        key={value}
                        className={cn(
                            'flex h-8 cursor-pointer items-center justify-center rounded-full px-2 text-center text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors',
                            'hover:text-foreground',
                            'has-checked:bg-input/50 has-checked:text-foreground',
                            'has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
                        )}
                        >
                        <input
                            type="radio"
                            className="sr-only"
                            name={field.name}
                            value={value}
                            checked={field.value === value}
                            onChange={() => field.onChange(value)}
                            onBlur={field.onBlur}
                            aria-invalid={fieldState.invalid}
                        />
                        {label}
                        </label>
                    ))}
                    </div>

                    <div aria-live="polite" className="min-h-10 text-center text-sm">
                    {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} className="text-center" />
                    ) : (
                        <p className="text-muted-foreground">
                        {selected?.description ?? 'Pick the option that fits you.'}
                        </p>
                    )}
                    </div>
                </FieldSet>
                )
            }}
            />
      </FieldGroup>
    </form>
  )
}