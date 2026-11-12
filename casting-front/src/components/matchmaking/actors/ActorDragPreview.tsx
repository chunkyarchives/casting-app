import { useEffect, useRef } from 'react'
import { GripIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useDragOperation } from '@dnd-kit/react'
import { cardOverlayClass, cardStripClass } from '@/components/common/cards/card-styles'
import { pullTowards } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { ActorSummary } from '@/types/actor'
import { actorName } from './actor-facts'
import { ActorPicture } from './ActorPicture'

export function ActorDragPreview({ actor }: { actor: ActorSummary }) {
  const { target } = useDragOperation()
  const frame = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (frame.current && card.current) pullTowards(card.current, frame.current, target?.element)
  }, [target])

  return (
    <div ref={frame} className="w-36">
      <div
        ref={card}
        className={cn(
          'cursor-grabbing overflow-hidden rounded-2xl border bg-card shadow-2xl ring-1 ring-primary/40 transition-[translate,scale,rotate] duration-300 ease-out motion-reduce:transition-none',
          target ? 'scale-[0.8] -rotate-6' : 'rotate-2',
        )}
      >
        <div className={cn(cardStripClass, 'flex items-center justify-center bg-black text-white')}>
          <HugeiconsIcon icon={GripIcon} strokeWidth={2} className="size-4" />
        </div>
        <div className="relative">
          <ActorPicture actorId={actor.id} />
          <div className={cardOverlayClass}>
            <span className="truncate font-bold">{actorName(actor)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}