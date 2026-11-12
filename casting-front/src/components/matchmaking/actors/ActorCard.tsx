import { useState } from 'react'
import { GripIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useDraggable } from '@dnd-kit/react'
import { cardOverlayClass, cardStripClass } from '@/components/common/cards/card-styles'
import { ExpandingDetails, ExpandingPanel } from '@/components/common/cards/ExpandingPanel'
import { useCardExpansion } from '@/components/common/cards/useCardExpansion'
import { CountryFlag } from '@/components/common/display/CountryFlag'
import { PortfolioSheet } from '@/components/portfolio/PortfolioSheet'
import { Button } from '@/components/ui/button'
import { countryName } from '@/lib/countries'
import { cn } from '@/lib/utils'
import type { ActorSummary } from '@/types/actor'
import { actorFacts, actorName } from './actor-facts'
import { ActorPicture } from './ActorPicture'

type Props = {
  actor: ActorSummary
  locked: boolean
}

export function ActorCard({ actor, locked }: Props) {
  const { ref, handleRef, isDragSource } = useDraggable({ id: actor.id, type: 'actor' })
  const { expanded, cardProps } = useCardExpansion(locked)
  const [portfolioOpen, setPortfolioOpen] = useState(false)
  const name = actorName(actor)

  return (
    <>
      <article
        ref={ref}
        {...cardProps}
        aria-label={name}
        className={cn(
          'relative rounded-2xl outline-none transition-opacity focus-visible:ring-[3px] focus-visible:ring-ring/50',
          isDragSource && 'opacity-40',
        )}
      >
        <div aria-hidden className="invisible flex flex-col">
          <div className={cardStripClass} />
          <div className="aspect-square" />
        </div>

        <ExpandingPanel expanded={expanded}>
          <button
            ref={handleRef}
            type="button"
            aria-label={`Drag ${name} onto a role`}
            title="Drag onto a role"
            className={cn(
              cardStripClass,
              'flex w-full cursor-grab touch-none items-center justify-center bg-black text-white/75 transition-colors outline-none hover:text-white focus-visible:text-white focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:ring-inset active:cursor-grabbing',
            )}
          >
            <HugeiconsIcon icon={GripIcon} strokeWidth={2} className="size-4" />
          </button>

          <div className="relative">
            <ActorPicture actorId={actor.id} />
            <div className={cn(cardOverlayClass, expanded && 'opacity-0')}>
              <span className="truncate font-bold">{name}</span>
            </div>
          </div>

          <ExpandingDetails expanded={expanded}>
            <h3 className="font-bold wrap-break-word">{name}</h3>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              {actorFacts(actor).map((line) => (
                <span key={line}>{line}</span>
              ))}
              {actor.origin && (
                <span className="flex items-center gap-1.5">
                  <CountryFlag code={actor.origin} decorative className="h-2.5" />
                  {countryName(actor.origin)}
                </span>
              )}
            </div>
            <Button type="button" className="w-full" onClick={() => setPortfolioOpen(true)}>
              View more
            </Button>
          </ExpandingDetails>
        </ExpandingPanel>
      </article>

      <PortfolioSheet actorId={actor.id} name={name} open={portfolioOpen} onOpenChange={setPortfolioOpen} />
    </>
  )
}