import { ApplicationList } from '@/components/application/board/ApplicationList'
import { proposalNote } from '@/components/application/board/strip-notes'
import { matchmakingRolesKey } from '@/components/matchmaking/matchmaking-queries'
import { toast } from '@/components/ui/toast'
import { forgetQuery } from '@/hooks/useApiQuery'
import { applicationsApi } from '@/lib/api/applications'
import type { RoleApplication } from '@/types/application'
import { UndoButton } from './UndoButton'

type Props = {
  proposals: RoleApplication[]
  onChange: (proposals: RoleApplication[]) => void
}

export function ProposalBoard({ proposals, onChange }: Props) {
  const undone = (proposal: RoleApplication) => {
    forgetQuery(matchmakingRolesKey)
    onChange(proposals.filter((item) => item.id !== proposal.id))
    toast.add({
      type: 'info',
      title: `${proposal.actorName} is no longer proposed for ${proposal.filmRoleName}`,
      description: proposal.filmTitle,
    })
  }

  return (
    <ApplicationList
      applications={proposals}
      onChange={onChange}
      saveOrder={applicationsApi.reorderProposals}
      note={proposalNote}
      renderActions={(proposal) => <UndoButton application={proposal} onUndone={undone} />}
    />
  )
}