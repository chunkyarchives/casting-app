import { useEffect, useState, type ReactNode, type SubmitEventHandler } from 'react'
import { FormProvider, useFormState, type FieldValues, type UseFormReturn } from 'react-hook-form'
import { SettingsFooter } from '@/components/settings/SettingsFooter'
import { SettingsHintContext } from '@/components/settings/settings-hint'

type Props<TValues extends FieldValues> = {
  id: string
  form: UseFormReturn<TValues>
  defaultHint: string
  onSubmit: SubmitEventHandler<HTMLFormElement>
  children: ReactNode
}

export function EditorForm<TValues extends FieldValues>({ id, form, defaultHint, onSubmit, children }: Props<TValues>) {
  const [hint, setHint] = useState<string | null>(null)
  const { isDirty, isSubmitting } = useFormState({ control: form.control })

  useEffect(() => {
    if (!isDirty) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [isDirty])

  return (
    <SettingsHintContext value={setHint}>
      <FormProvider {...form}>
        <form id={id} noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
          {children}
        </form>
      </FormProvider>

      <SettingsFooter
        hint={hint}
        defaultHint={defaultHint}
        dirty={isDirty}
        saving={isSubmitting}
        formId={id}
        onDiscard={() => form.reset()}
      />
    </SettingsHintContext>
  )
}