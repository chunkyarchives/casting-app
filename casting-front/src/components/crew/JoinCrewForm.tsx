import { useId, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { crewsApi } from '@/lib/api/crews'
import { cn } from '@/lib/utils'
import { joinCrewSchema, type JoinCrewValues } from '@/lib/validation/crew'
import type { Crew } from '@/types/crew'
import { joinErrorMessage } from './crew-errors'

type Props = {
  onJoined: (crew: Crew) => void
}

export function JoinCrewForm({ onJoined }: Props) {
  const id = useId()
  const [problem, setProblem] = useState<string | null>(null)
  const { control, handleSubmit, reset, formState } = useForm<JoinCrewValues>({
    resolver: zodResolver(joinCrewSchema),
    defaultValues: { productionCode: '' },
  })

  const submit = async (values: JoinCrewValues) => {
    setProblem(null)
    const crew = await crewsApi.join(values.productionCode.trim().toUpperCase()).catch((error: unknown) => {
      setProblem(joinErrorMessage(error))
      return null
    })
    if (!crew) return

    reset({ productionCode: '' })
    onJoined(crew)
  }

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(submit)(event)}
      className="mx-auto flex w-full max-w-md flex-col gap-4"
    >
      <Controller
        name="productionCode"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="text-center">
            <FieldLabel htmlFor={id} className="justify-center text-lg">
              Join a crew
            </FieldLabel>
            <InputGroup className="h-11">
              <InputGroupInput
                {...field}
                id={id}
                maxLength={6}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="Production code"
                className={cn(field.value && 'tracking-widest')}
                disabled={formState.isSubmitting}
                aria-invalid={fieldState.invalid}
                onChange={(event) => field.onChange(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="submit"
                  variant="default"
                  size="sm"
                  className="h-8 px-4"
                  disabled={formState.isSubmitting}
                >
                  {formState.isSubmitting ? 'Joining…' : 'Join'}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {fieldState.invalid ? (
              <FieldError errors={[fieldState.error]} />
            ) : (
              <FieldDescription>Ask the director for the 6 character code of their production.</FieldDescription>
            )}
          </Field>
        )}
      />

      {problem && (
        <Alert variant="destructive">
          <AlertDescription>{problem}</AlertDescription>
        </Alert>
      )}
    </form>
  )
}