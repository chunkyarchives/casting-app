import { useState } from 'react'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { crewsApi } from '@/lib/api/crews'
import { cn } from '@/lib/utils'
import type { Crew } from '@/types/crew'
import { ConfirmCrewDialog } from './ConfirmCrewDialog'
import { CrewMembers } from './CrewMembers'
import { ProductionCode } from './ProductionCode'

type Props = {
  crew: Crew
  viewerId: string | undefined
  animate: boolean
  onDeleted: () => void
}

export function CrewOverview({ crew, viewerId, animate, onDeleted }: Props) {
  const [confirming, setConfirming] = useState(false)

  const remove = async () => {
    await crewsApi.remove(crew.id)
    setConfirming(false)
    onDeleted()
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col items-center gap-5 text-center">
        <h1
          className={cn(
            'text-3xl font-bold text-balance break-words',
            animate && 'animate-in duration-500 fade-in-0 slide-in-from-bottom-3 motion-reduce:animate-none',
          )}
        >
          {crew.productionName}
        </h1>

        {crew.productionCode && (
          <div className="flex flex-col items-center gap-2">
            <ProductionCode code={crew.productionCode} animate={animate} />
            <p className="text-sm text-muted-foreground">Share this code with casting directors so they can join.</p>
          </div>
        )}

        <Button variant="destructive" size="sm" onClick={() => setConfirming(true)}>
          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} data-icon="inline-start" />
          Delete crew
        </Button>
      </div>

      <CrewMembers
        crew={crew}
        viewerId={viewerId}
        emptyHint="No casting directors yet. They show up here once they join with your code."
      />

      <ConfirmCrewDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={`Delete ${crew.productionName}?`}
        description="Every casting director in this crew loses access, and the production code stops working. This can't be undone."
        confirmLabel="Delete crew"
        pendingLabel="Deleting…"
        onConfirm={remove}
      />
    </div>
  )
}