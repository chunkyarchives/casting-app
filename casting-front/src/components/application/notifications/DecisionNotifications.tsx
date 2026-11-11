import { useEffect, useEffectEvent } from 'react'
import { toast } from '@/components/ui/toast'
import { forgetQuery } from '@/hooks/useApiQuery'
import { subscribeToApplicationDecisions } from '@/lib/chat/chat-hub'
import type { RoleApplication } from '@/types/application'

const toastTimeoutMs = 8000

export default function DecisionNotifications() {
  const announce = useEffectEvent((application: RoleApplication) => {
    forgetQuery('actor-open-roles')

    if (application.status === 'Accepted') {
      toast.add({
        type: 'success',
        title: `You got the role of ${application.filmRoleName}`,
        description: `${application.filmTitle}. The director will message you about the next steps.`,
        timeout: toastTimeoutMs,
      })
      return
    }

    toast.add({
      type: 'info',
      title: `Your application for ${application.filmRoleName} was declined`,
      description: application.filmTitle,
      timeout: toastTimeoutMs,
    })
  })

  useEffect(() => subscribeToApplicationDecisions({ onApplicationDecided: (application) => announce(application) }), [])

  return null
}