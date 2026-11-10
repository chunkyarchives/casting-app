import { useId, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { crewsApi } from '@/lib/api/crews'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { createCrewSchema, type CreateCrewValues } from '@/lib/validation/crew'
import type { Crew } from '@/types/crew'
import { crewErrorMessage } from '../shared/crew-errors'

const leaveMs = 300

type Props = {
  onCreated: (crew: Crew) => void
}

export function CreateCrewForm({ onCreated }: Props) {
  const id = useId()
  const [problem, setProblem] = useState<string | null>(null)
  const [leaving, setLeaving] = useState(false)
  const { control, handleSubmit, formState } = useForm<CreateCrewValues>({
    resolver: zodResolver(createCrewSchema),
    defaultValues: { productionName: '' },
  })
  const busy = formState.isSubmitting || leaving

  const submit = async (values: CreateCrewValues) => {
    setProblem(null)
    const crew = await crewsApi.create(values.productionName.trim()).catch((error: unknown) => {
      setProblem(crewErrorMessage(error))
      return null
    })
    if (!crew) return

    setLeaving(true)
    window.setTimeout(() => onCreated(crew), prefersReducedMotion() ? 0 : leaveMs)
  }

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(submit)(event)}
      className={cn(
        'flex w-full max-w-md flex-col gap-4 duration-300 motion-reduce:animate-none',
        leaving
          ? 'animate-out fill-mode-forwards fade-out-0 slide-out-to-top-4'
          : 'animate-in fade-in-0 slide-in-from-bottom-2',
      )}
    >
      <Controller
        name="productionName"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="text-center">
            <FieldLabel htmlFor={id} className="justify-center text-lg">
              Create your crew
            </FieldLabel>
            <InputGroup className="h-11">
              <InputGroupInput
                {...field}
                id={id}
                maxLength={200}
                autoComplete="off"
                placeholder="Production name"
                disabled={busy}
                aria-invalid={fieldState.invalid}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton type="submit" variant="default" size="sm" className="h-8 px-4" disabled={busy}>
                  {formState.isSubmitting ? 'Creating…' : 'Create'}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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