import type { ReactNode } from 'react'
import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers'
import { move } from '@dnd-kit/helpers'
import { DragDropProvider } from '@dnd-kit/react'
import { toast } from '@/components/ui/toast'
import { apiErrorMessage } from '@/lib/api/errors'
import type { RoleApplication } from '@/types/application'
import { ApplicationStrip } from './ApplicationStrip'

type Props = {
  applications: RoleApplication[]
  onChange: (applications: RoleApplication[]) => void
  saveOrder: (applicationIds: string[]) => Promise<void>
  note: (application: RoleApplication) => string
  renderActions: (application: RoleApplication) => ReactNode
}

const sameOrder = (a: RoleApplication[], b: RoleApplication[]) => a.every((item, index) => item.id === b[index]?.id)

export function ApplicationList({ applications, onChange, saveOrder, note, renderActions }: Props) {
  const reorder = async (next: RoleApplication[], previous: RoleApplication[]) => {
    onChange(next)
    await saveOrder(next.map((application) => application.id)).catch((error: unknown) => {
      toast.add({ type: 'error', title: 'The new order could not be saved', description: apiErrorMessage(error) })
      onChange(previous)
    })
  }

  return (
    <DragDropProvider
      modifiers={[RestrictToVerticalAxis]}
      onDragEnd={(event) => {
        if (event.canceled) return
        const next = move(applications, event)
        if (!sameOrder(next, applications)) void reorder(next, applications)
      }}
    >
      <ul className="flex flex-col gap-4">
        {applications.map((application, index) => (
          <ApplicationStrip key={application.id} application={application} index={index} note={note(application)}>
            {renderActions(application)}
          </ApplicationStrip>
        ))}
      </ul>
    </DragDropProvider>
  )
}