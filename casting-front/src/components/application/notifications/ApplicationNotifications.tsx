import { useEffect, useEffectEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { pendingApplicationsKey } from '@/components/application/hooks/usePendingApplications'
import { toast } from '@/components/ui/toast'
import { forgetQuery } from '@/hooks/useApiQuery'
import { subscribeToApplications, subscribeToApplicationWithdrawals } from '@/lib/chat/chat-hub'
import { rolePath } from '@/lib/routes'
import type { RoleApplication } from '@/types/application'
import { applicationTitle, withdrawalTitle } from './application-text'

const toastTimeoutMs = 6000
const applicationsPath = rolePath('Director', 'applications')

export default function ApplicationNotifications() {
  const navigate = useNavigate()
  const location = useLocation()

  const forgetLists = (application: RoleApplication) => {
    forgetQuery('chat-applicants')
    forgetQuery(`chat-actor-applications-${application.actorId}`)
    if (location.pathname !== applicationsPath) forgetQuery(pendingApplicationsKey)
  }

  const announce = useEffectEvent((application: RoleApplication) => {
    forgetLists(application)

    const id = toast.add({
      type: 'info',
      title: applicationTitle(application),
      description: application.filmTitle,
      timeout: toastTimeoutMs,
      actionProps:
        location.pathname === applicationsPath
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

  const withdrawn = useEffectEvent((application: RoleApplication) => {
    forgetLists(application)
    toast.add({
      type: 'info',
      title: withdrawalTitle(application),
      description: application.filmTitle,
      timeout: toastTimeoutMs,
    })
  })

  useEffect(() => {
    const stopReceived = subscribeToApplications({ onApplication: (application) => announce(application) })
    const stopWithdrawn = subscribeToApplicationWithdrawals({ onApplicationWithdrawn: (application) => withdrawn(application) })
    return () => {
      stopReceived()
      stopWithdrawn()
    }
  }, [])

  return null
}