import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers'
import { move } from '@dnd-kit/helpers'
import { DragDropProvider } from '@dnd-kit/react'
import { useNavigate } from 'react-router'
import { toast } from '@/components/ui/toast'
import { forgetQuery } from '@/hooks/useApiQuery'
import { applicationsApi } from '@/lib/api/applications'
import { conversationsApi } from '@/lib/api/conversations'
import { apiErrorMessage } from '@/lib/api/errors'
import { rolePath } from '@/lib/routes'
import type { RoleApplication } from '@/types/application'
import { ApplicationStrip } from './ApplicationStrip'
import type { Decision } from './decision-styles'

type Props = {
  applications: RoleApplication[]
  onChange: (applications: RoleApplication[]) => void
  onReload: () => void
}

const sameOrder = (a: RoleApplication[], b: RoleApplication[]) => a.every((item, index) => item.id === b[index]?.id)

export function ApplicationBoard({ applications, onChange, onReload }: Props) {
  const navigate = useNavigate()

  const saveOrder = async (next: RoleApplication[], previous: RoleApplication[]) => {
    onChange(next)
    await applicationsApi.reorder(next.map((application) => application.id)).catch((error: unknown) => {
      toast.add({ type: 'error', title: 'The new order could not be saved', description: apiErrorMessage(error) })
      onChange(previous)
    })
  }

  const openChat = async (actorId: string) => {
    const conversation = await conversationsApi.start(actorId).catch((error: unknown) => {
      toast.add({ type: 'error', title: 'The chat could not be opened', description: apiErrorMessage(error) })
      return null
    })
    if (!conversation) return
    void navigate({ pathname: rolePath('Director', 'chat'), search: new URLSearchParams({ chat: conversation.id }).toString() })
  }

  const decided = (application: RoleApplication, decision: Decision) => {
    forgetQuery(`chat-actor-applications-${application.actorId}`)

    if (decision === 'reject') {
      onChange(applications.filter((item) => item.id !== application.id))
      toast.add({ type: 'info', title: `${application.actorName} was rejected for ${application.filmRoleName}` })
      return
    }

    onChange(applications.filter((item) => item.filmRoleId !== application.filmRoleId))
    const id = toast.add({
      type: 'success',
      title: `${application.actorName} got the role of ${application.filmRoleName}`,
      description: application.filmTitle,
      actionProps: {
        children: 'Message',
        onClick: () => {
          toast.close(id)
          void openChat(application.actorId)
        },
      },
    })
  }

  return (
    <DragDropProvider
      modifiers={[RestrictToVerticalAxis]}
      onDragEnd={(event) => {
        if (event.canceled) return
        const next = move(applications, event)
        if (!sameOrder(next, applications)) void saveOrder(next, applications)
      }}
    >
      <ul className="flex flex-col gap-4">
        {applications.map((application, index) => (
          <ApplicationStrip
            key={application.id}
            application={application}
            index={index}
            onDecided={decided}
            onFailed={onReload}
          />
        ))}
      </ul>
    </DragDropProvider>
  )
}