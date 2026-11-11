import { useEffect, useEffectEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { toast } from '@/components/ui/toast'
import { forgetQuery } from '@/hooks/useApiQuery'
import { subscribeToApplications } from '@/lib/chat/chat-hub'
import { filmPaths } from '@/lib/routes'
import type { RoleApplication } from '@/types/application'
import { applicationTitle } from './application-text'

const toastTimeoutMs = 6000

export default function ApplicationNotifications() {
  const navigate = useNavigate()
  const location = useLocation()

  const announce = useEffectEvent((application: RoleApplication) => {
    forgetQuery('chat-applicants')
    forgetQuery(`chat-actor-applications-${application.actorId}`)

    const filmPath = filmPaths.film(application.filmId)
    const onFilmPage = location.pathname === filmPath
    const id = toast.add({
      type: 'info',
      title: applicationTitle(application),
      description: application.filmTitle,
      timeout: toastTimeoutMs,
      actionProps: onFilmPage
        ? undefined
        : {
            children: 'View',
            onClick: () => {
              toast.close(id)
              void navigate(filmPath)
            },
          },
    })
  })

  useEffect(() => subscribeToApplications({ onApplication: (application) => announce(application) }), [])

  return null
}