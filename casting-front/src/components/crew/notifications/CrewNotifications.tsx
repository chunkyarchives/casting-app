import { useEffect, useEffectEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { toast } from '@/components/ui/toast'
import { subscribeToCrew } from '@/lib/chat/chat-hub'
import { rolePath } from '@/lib/routes'
import type { CrewMemberChange } from '@/types/crew'
import type { CurrentParticipant } from '@/types/participant'
import { crewChangeTitle } from './crew-change-text'

const toastTimeoutMs = 6000

export default function CrewNotifications({ viewer }: { viewer: CurrentParticipant }) {
  const navigate = useNavigate()
  const location = useLocation()
  const crewPath = rolePath(viewer.role, 'crew')

  const announce = useEffectEvent((change: CrewMemberChange) => {
    const onCrewPage = location.pathname === crewPath
    const id = toast.add({
      type: 'info',
      title: crewChangeTitle(change, viewer.id),
      timeout: toastTimeoutMs,
      actionProps: onCrewPage
        ? undefined
        : {
            children: 'View',
            onClick: () => {
              toast.close(id)
              void navigate(crewPath)
            },
          },
    })
  })

  useEffect(() => subscribeToCrew({ onCrewChange: (change) => announce(change) }), [])

  return null
}