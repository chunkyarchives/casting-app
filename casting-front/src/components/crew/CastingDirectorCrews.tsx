import { UserGroupIcon } from '@hugeicons/core-free-icons'
import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { LoadError } from '@/components/common/states/LoadError'
import { PageLoader } from '@/components/common/states/PageLoader'
import { toast } from '@/components/ui/toast'
import { CrewCard } from './casting-director/CrewCard'
import { JoinCrewForm } from './casting-director/JoinCrewForm'
import { useMyCrews } from './hooks/useMyCrews'

export function CastingDirectorCrews() {
  const participant = useCurrentParticipant()
  const { state, update, reload } = useMyCrews()

  return (
    <div className="flex w-full flex-col gap-10">
      <JoinCrewForm
        onJoined={(crew) => {
          update((crews) => [crew, ...crews.filter((current) => current.id !== crew.id)])
          toast.add({ type: 'success', title: `You joined ${crew.productionName}` })
        }}
      />

      {state.status === 'loading' && <PageLoader />}
      {state.status === 'error' && <LoadError title="Your crews could not be loaded" error={state.error} onRetry={reload} />}
      {state.status === 'ready' && state.crews.length === 0 && (
        <EmptyMessage
          icon={UserGroupIcon}
          title="No crews yet"
          description="Once you join a crew with its production code, it shows up here."
        />
      )}
      {state.status === 'ready' && state.crews.length > 0 && participant && (
        <section aria-label="Your crews" className="flex flex-col gap-4">
          {state.crews.map((crew) => (
            <CrewCard
              key={crew.id}
              crew={crew}
              viewerId={participant.id}
              onLeft={() => {
                update((crews) => crews.filter((current) => current.id !== crew.id))
                toast.add({ type: 'success', title: `You left ${crew.productionName}` })
              }}
            />
          ))}
        </section>
      )}
    </div>
  )
}