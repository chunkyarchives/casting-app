import { useEffect, useEffectEvent } from 'react'
import { UserSearch01Icon } from '@hugeicons/core-free-icons'
import { ApplicationBoard } from '@/components/application/board/ApplicationBoard'
import { usePendingApplications } from '@/components/application/hooks/usePendingApplications'
import { SectionTitle } from '@/components/common/display/SectionTitle'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { LoadError } from '@/components/common/states/LoadError'
import { Skeleton } from '@/components/ui/skeleton'
import { subscribeToApplications, subscribeToApplicationWithdrawals } from '@/lib/chat/chat-hub'
import type { RoleApplication } from '@/types/application'

const placeholders = Array.from({ length: 3 }, (_, index) => index)

export function DirectorApplications() {
  const applications = usePendingApplications()

  const received = useEffectEvent((application: RoleApplication) => {
    if (applications.status !== 'success') return
    if (applications.data.some((item) => item.id === application.id)) return
    applications.setData([...applications.data, application])
  })

  const withdrawn = useEffectEvent((application: RoleApplication) => {
    if (applications.status !== 'success') return
    applications.setData(applications.data.filter((item) => item.id !== application.id))
  })

  useEffect(() => {
    const stopReceived = subscribeToApplications({ onApplication: (application) => received(application) })
    const stopWithdrawn = subscribeToApplicationWithdrawals({ onApplicationWithdrawn: (application) => withdrawn(application) })
    return () => {
      stopReceived()
      stopWithdrawn()
    }
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pt-2 pb-16">
      <SectionTitle as="h1" size="page">
        Applications
      </SectionTitle>

      {applications.status === 'loading' && (
        <ul aria-hidden className="flex flex-col gap-4">
          {placeholders.map((index) => (
            <li key={index}>
              <Skeleton className="h-36 rounded-2xl" />
            </li>
          ))}
        </ul>
      )}
      {applications.status === 'error' && (
        <LoadError title="Applications could not be loaded" error={applications.error} onRetry={applications.reload} />
      )}
      {applications.status === 'success' && applications.data.length === 0 && (
        <EmptyMessage
          icon={UserSearch01Icon}
          title="No applications right now"
          description="When an actor applies for one of your roles, it shows up here."
        />
      )}
      {applications.status === 'success' && applications.data.length > 0 && (
        <ApplicationBoard applications={applications.data} onChange={applications.setData} onReload={applications.reload} />
      )}
    </div>
  )
}