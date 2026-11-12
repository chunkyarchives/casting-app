import { useEffect, useEffectEvent } from 'react'
import { useLocation } from 'react-router'
import { pendingProposalsKey } from '@/components/application/hooks/usePendingProposals'
import { matchmakingRolesKey } from '@/components/matchmaking/matchmaking-queries'
import { toast } from '@/components/ui/toast'
import { forgetQuery } from '@/hooks/useApiQuery'
import { subscribeToApplicationDecisions } from '@/lib/chat/chat-hub'
import { rolePath } from '@/lib/routes'
import type { RoleApplication } from '@/types/application'
import { proposalDecisionTitle } from './application-text'

const toastTimeoutMs = 6000
const proposalsPath = rolePath('CastingDirector', 'proposals')
const matchmakingPath = rolePath('CastingDirector', 'matchmaking')

export default function ProposalNotifications() {
  const location = useLocation()

  const decided = useEffectEvent((application: RoleApplication) => {
    if (location.pathname !== proposalsPath) forgetQuery(pendingProposalsKey)
    if (location.pathname !== matchmakingPath) forgetQuery(matchmakingRolesKey)

    toast.add({
      type: application.status === 'Accepted' ? 'success' : 'info',
      title: proposalDecisionTitle(application),
      description: application.filmTitle,
      timeout: toastTimeoutMs,
    })
  })

  useEffect(() => subscribeToApplicationDecisions({ onApplicationDecided: (application) => decided(application) }), [])

  return null
}