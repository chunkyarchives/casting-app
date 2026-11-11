import { useEffect, useEffectEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { pendingApplicationsKey } from '@/components/application/hooks/usePendingApplications'
import { toast } from '@/components/ui/toast'
import { forgetQuery } from '@/hooks/useApiQuery'
import { subscribeToApplications } from '@/lib/chat/chat-hub'
import { rolePath } from '@/lib/routes'
import type { RoleApplication } from '@/types/application'
import { applicationTitle } from './application-text'

const toastTimeoutMs = 6000
const applicationsPath = rolePath('Director', 'applications')

export default function ApplicationNotifications() {
  const navigate = useNavigate()
  const location = useLocation()

  const announce = useEffectEvent((application: RoleApplication) => {
    forgetQuery('chat-applicants')
    forgetQuery(`chat-actor-applications-${application.actorId}`)

    const onApplicationsPage = location.pathname === applicationsPath
    if (!onApplicationsPage) forgetQuery(pendingApplicationsKey)

    const id = toast.add({
      type: 'info',
      title: applicationTitle(application),
      description: application.filmTitle,
      timeout: toastTimeoutMs,
      actionProps: onApplicationsPage
        ? undefined
        : {
            children: 'View',
            onClick: () => {
              toast.close(id)
              void navigate(applicationsPath)
            },
          },
    })
  })

  useEffect(() => subscribeToApplications({ onApplication: (application) => announce(application) }), [])

  return null
}