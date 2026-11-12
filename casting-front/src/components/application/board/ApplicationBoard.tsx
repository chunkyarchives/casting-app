import { useNavigate } from 'react-router'
import { toast } from '@/components/ui/toast'
import { forgetQuery } from '@/hooks/useApiQuery'
import { applicationsApi } from '@/lib/api/applications'
import { conversationsApi } from '@/lib/api/conversations'
import { apiErrorMessage } from '@/lib/api/errors'
import { rolePath } from '@/lib/routes'
import type { RoleApplication } from '@/types/application'
import { ApplicationList } from './ApplicationList'
import { DecisionButtons } from './DecisionButtons'
import { applicationNote } from './strip-notes'
import type { Decision } from './strip-styles'

type Props = {
  applications: RoleApplication[]
  onChange: (applications: RoleApplication[]) => void
  onReload: () => void
}

export function ApplicationBoard({ applications, onChange, onReload }: Props) {
  const navigate = useNavigate()

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
    <ApplicationList
      applications={applications}
      onChange={onChange}
      saveOrder={applicationsApi.reorder}
      note={applicationNote}
      renderActions={(application) => (
        <DecisionButtons application={application} onDecided={decided} onFailed={onReload} />
      )}
    />
  )
}