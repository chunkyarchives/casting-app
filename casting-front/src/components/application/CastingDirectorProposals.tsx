import { useEffect, useEffectEvent } from 'react'
import { Agreement01Icon } from '@hugeicons/core-free-icons'
import { Link } from 'react-router'
import { usePendingProposals } from '@/components/application/hooks/usePendingProposals'
import { ProposalBoard } from '@/components/application/proposals/ProposalBoard'
import { SectionTitle } from '@/components/common/display/SectionTitle'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { LoadError } from '@/components/common/states/LoadError'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { subscribeToApplicationDecisions } from '@/lib/chat/chat-hub'
import { rolePath } from '@/lib/routes'
import type { RoleApplication } from '@/types/application'

const placeholders = Array.from({ length: 3 }, (_, index) => index)

export function CastingDirectorProposals() {
  const proposals = usePendingProposals()

  const decided = useEffectEvent((application: RoleApplication) => {
    if (proposals.status !== 'success') return
    proposals.setData(proposals.data.filter((item) => item.id !== application.id))
  })

  useEffect(() => subscribeToApplicationDecisions({ onApplicationDecided: (application) => decided(application) }), [])

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pt-2 pb-16">
      <SectionTitle as="h1" size="page">
        Proposals
      </SectionTitle>

      {proposals.status === 'loading' && (
        <ul aria-hidden className="flex flex-col gap-4">
          {placeholders.map((index) => (
            <li key={index}>
              <Skeleton className="h-32 rounded-2xl" />
            </li>
          ))}
        </ul>
      )}
      {proposals.status === 'error' && (
        <LoadError title="Proposals could not be loaded" error={proposals.error} onRetry={proposals.reload} />
      )}
      {proposals.status === 'success' && proposals.data.length === 0 && (
        <EmptyMessage
          icon={Agreement01Icon}
          title="No proposals right now"
          description="Drag an actor onto a role in Matchmaking to propose them to the director."
        >
          <Link to={rolePath('CastingDirector', 'matchmaking')} className={buttonVariants({ variant: 'outline' })}>
            Open Matchmaking
          </Link>
        </EmptyMessage>
      )}
      {proposals.status === 'success' && proposals.data.length > 0 && (
        <ProposalBoard proposals={proposals.data} onChange={proposals.setData} />
      )}
    </div>
  )
}