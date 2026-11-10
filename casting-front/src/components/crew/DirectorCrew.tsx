import { useState } from 'react'
import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'
import { LoadError } from '@/components/common/states/LoadError'
import { PageLoader } from '@/components/common/states/PageLoader'
import { toast } from '@/components/ui/toast'
import { CreateCrewForm } from './CreateCrewForm'
import { CrewOverview } from './CrewOverview'
import { useMyCrews } from './useMyCrews'

export function DirectorCrew() {
  const participant = useCurrentParticipant()
  const { state, update, reload } = useMyCrews()
  const [justCreated, setJustCreated] = useState(false)

  if (state.status === 'loading') return <PageLoader />
  if (state.status === 'error') return <LoadError title="Your crew could not be loaded" error={state.error} onRetry={reload} />

  const crew = state.crews.at(0)

  if (!crew) {
    return (
      <CreateCrewForm
        onCreated={(created) => {
          setJustCreated(true)
          update(() => [created])
        }}
      />
    )
  }

  return (
    <CrewOverview
      key={crew.id}
      crew={crew}
      viewerId={participant?.id}
      animate={justCreated}
      onDeleted={() => {
        setJustCreated(false)
        update(() => [])
        toast.add({ type: 'success', title: 'Crew deleted' })
      }}
    />
  )
}