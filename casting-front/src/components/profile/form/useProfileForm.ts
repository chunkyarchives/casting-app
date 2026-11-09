import { useEffect, useState } from 'react'
import { useForm, type DefaultValues, type FieldValues, type Resolver } from 'react-hook-form'
import { useSession } from '@/components/auth/session/session-context'
import { toast } from '@/components/ui/toast'
import { apiErrorMessage } from '@/lib/api/errors'
import { saveProfile, showServerErrors, type ProfileName } from './profile-form'

type Options<TValues extends FieldValues & ProfileName, TProfile> = {
  profile: TProfile
  name: ProfileName
  resolver: Resolver<TValues>
  toValues: (profile: TProfile, name: ProfileName) => TValues
  update: (values: TValues) => Promise<TProfile>
  onSaved: () => void
}

export function useProfileForm<TValues extends FieldValues & ProfileName, TProfile>({
  profile,
  name,
  resolver,
  toValues,
  update,
  onSaved,
}: Options<TValues, TProfile>) {
  const { refresh } = useSession()
  const [saved, setSaved] = useState(profile)

  const form = useForm<TValues>({
    resolver,
    defaultValues: toValues(profile, name) as DefaultValues<TValues>,
    mode: 'onTouched',
  })
  const { isDirty, dirtyFields } = form.formState

  useEffect(() => {
    if (!isDirty) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [isDirty])

  const save = async (values: TValues) => {
    try {
      const next = await saveProfile(values, dirtyFields, saved, () => update(values))
      await refresh()
      setSaved(next)
      form.reset(toValues(next, values))
      onSaved()
      toast.add({ type: 'success', title: 'Profile saved' })
    } catch (error) {
      if (!showServerErrors(error, form.setError)) {
        toast.add({ type: 'error', title: 'Your profile could not be saved', description: apiErrorMessage(error) })
      }
    }
  }

  return { form, saved, submit: form.handleSubmit(save) }
}