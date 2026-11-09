import { useState, type FormEventHandler, type ReactNode } from 'react'
import { FormProvider, useFormState, type FieldValues, type UseFormReturn } from 'react-hook-form'
import { SettingsFooter } from '@/components/settings/SettingsFooter'
import { SettingsHintContext } from '@/components/settings/settings-hint'
import { Separator } from '@/components/ui/separator'

type Props<TValues extends FieldValues> = {
  id: string
  form: UseFormReturn<TValues>
  card: ReactNode
  onSubmit: FormEventHandler<HTMLFormElement>
  children: ReactNode
}

export function ProfileForm<TValues extends FieldValues>({ id, form, card, onSubmit, children }: Props<TValues>) {
  const [hint, setHint] = useState<string | null>(null)
  const { isDirty, isSubmitting } = useFormState({ control: form.control })

  return (
    <SettingsHintContext value={setHint}>
      {card}
      <Separator />

      <FormProvider {...form}>
        <form id={id} noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
          {children}
        </form>
      </FormProvider>

      <SettingsFooter
        hint={hint}
        defaultHint="Point at a setting to see what it is for. Your changes are saved together when you press Save."
        dirty={isDirty}
        saving={isSubmitting}
        formId={id}
        onDiscard={() => form.reset()}
      />
    </SettingsHintContext>
  )
}