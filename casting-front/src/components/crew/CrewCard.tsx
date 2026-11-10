import { useState } from 'react'
import { Logout03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { crewsApi } from '@/lib/api/crews'
import type { Crew } from '@/types/crew'
import { ConfirmCrewDialog } from './ConfirmCrewDialog'
import { CrewMembers } from './CrewMembers'
import { ProductionCode } from './ProductionCode'

type Props = {
  crew: Crew
  viewerId: string
  onLeft: () => void
}

export function CrewCard({ crew, viewerId, onLeft }: Props) {
  const [confirming, setConfirming] = useState(false)

  const leave = async () => {
    await crewsApi.leave(crew.id, viewerId)
    setConfirming(false)
    onLeft()
  }

  return (
    <article className="flex animate-in flex-col gap-5 rounded-3xl border bg-card p-5 duration-300 fade-in-0 slide-in-from-bottom-2 motion-reduce:animate-none">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <h2 className="text-xl font-bold break-words">{crew.productionName}</h2>
          {crew.productionCode && <ProductionCode code={crew.productionCode} tone="soft" />}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => setConfirming(true)}
        >
          <HugeiconsIcon icon={Logout03Icon} strokeWidth={2} data-icon="inline-start" />
          Leave crew
        </Button>
      </header>

      <CrewMembers crew={crew} viewerId={viewerId} headingLevel={3} />

      <ConfirmCrewDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={`Leave ${crew.productionName}?`}
        description="You lose access to this crew. You can join again later with its production code."
        confirmLabel="Leave crew"
        pendingLabel="Leaving…"
        onConfirm={leave}
      />
    </article>
  )
}