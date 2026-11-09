import { useState } from 'react'
import { FormProvider, useForm, useFormState } from 'react-hook-form'
import { useSession } from '@/components/auth/session/session-context'
import { SettingsFooter } from '@/components/settings/SettingsFooter'
import { SettingsGroup } from '@/components/settings/SettingsGroup'
import { SettingsHintContext } from '@/components/settings/settings-hint'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/toast'
import { accountApi } from '@/lib/api/accounts'
import { apiErrorMessage } from '@/lib/api/errors'
import type { VisibilityValues } from '@/lib/validation/account'
import type { CurrentParticipant } from '@/types/participant'
import { DangerZone } from './DangerZone'
import { VisibilityRow } from './VisibilityRow'

const formId = 'privacy-settings'

export function PrivacyForm({ participant }: { participant: CurrentParticipant }) {
  const { refresh } = useSession()
  const [hint, setHint] = useState<string | null>(null)

  const form = useForm<VisibilityValues>({
    defaultValues: { isProfilePublic: participant.isProfilePublic },
  })
  const { isDirty, isSubmitting } = useFormState({ control: form.control })

  const save = async (values: VisibilityValues) => {
    const title = values.isProfilePublic ? 'Your profile is public' : 'Your profile is private'

    try {
      await accountApi.updateVisibility(values.isProfilePublic)
      await refresh()
      form.reset(values)
      toast.add({ type: 'success', title })
    } catch (error) {
      toast.add({ type: 'error', title: 'Your privacy could not be saved', description: apiErrorMessage(error) })
    }
  }

  return (
    <SettingsHintContext value={setHint}>
      <FormProvider {...form}>
        <form id={formId} noValidate onSubmit={form.handleSubmit(save)} className="flex flex-col gap-6">
          <SettingsGroup title="Visibility">
            <VisibilityRow />
          </SettingsGroup>
        </form>
      </FormProvider>

      <Separator />

      <DangerZone role={participant.role} />

      <SettingsFooter
        hint={hint}
        defaultHint="Point at a setting to see what it is for. Visibility is saved when you press Save."
        dirty={isDirty}
        saving={isSubmitting}
        formId={formId}
        onDiscard={() => form.reset()}
      />
    </SettingsHintContext>
  )
}