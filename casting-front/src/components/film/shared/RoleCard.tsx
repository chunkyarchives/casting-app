import { useState, type ReactNode, type Ref } from 'react'
import { MaskTheater01Icon } from '@hugeicons/core-free-icons'
import { cardStripClass, dropTargetClass, dropZoneClass } from '@/components/common/cards/card-styles'
import { DropVortex } from '@/components/common/cards/DropVortex'
import { Collapse, ExpandingDetails, ExpandingPanel } from '@/components/common/cards/ExpandingPanel'
import { useCardExpansion } from '@/components/common/cards/useCardExpansion'
import { CountryFlag } from '@/components/common/display/CountryFlag'
import { StatusDot } from '@/components/common/display/StatusDot'
import { MediaCarousel } from '@/components/common/media/MediaCarousel'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { FilmRole } from '@/types/film'
import { roleFacts } from './role-facts'

type Props = {
  role: FilmRole
  subtitle?: string
  action?: ReactNode
  footer?: ReactNode
  ref?: Ref<HTMLElement>
  dropTarget?: boolean
  locked?: boolean
}

export function RoleCard({ role, subtitle, action, footer, ref, dropTarget, locked = false }: Props) {
  const { expanded, opened, cardProps } = useCardExpansion(locked)
  const [index, setIndex] = useState(0)
  const filled = role.status === 'Filled'
  const droppable = dropTarget !== undefined
  const shownIndex = Math.min(index, Math.max(role.conceptArt.length - 1, 0))
  const art = role.conceptArt.at(shownIndex)
  const factGroups = roleFacts(role)

  return (
    <article
      ref={ref}
      {...cardProps}
      aria-label={role.name}
      className={cn(
        'relative rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
        droppable && dropZoneClass,
        dropTarget && dropTargetClass,
      )}
    >
      <div aria-hidden className="invisible flex flex-col">
        <div className="aspect-square" />
        <div className={cardStripClass} />
      </div>

      <ExpandingPanel expanded={expanded}>
        <div className="relative">
          <div className={cn(filled && 'opacity-70 grayscale')}>
            <MediaCarousel
              items={role.conceptArt}
              label={`Concept art for ${role.name}`}
              itemLabel={(position) => `Concept art ${position + 1} for ${role.name}`}
              emptyIcon={MaskTheater01Icon}
              index={shownIndex}
              onIndexChange={setIndex}
              controls={expanded}
              loadAll={opened}
            />
          </div>

          {droppable && <DropVortex active={dropTarget} />}

          {action && (
            <div
              className={cn(
                'absolute top-2 right-2 flex gap-1 transition-opacity duration-200',
                !expanded && 'pointer-events-none opacity-0',
              )}
            >
              {action}
            </div>
          )}
        </div>

        <Collapse open={!expanded}>
          <div className={cn(cardStripClass, 'flex items-center gap-2 bg-black px-2.5 text-xs text-white')}>
            <span className="min-w-0 flex-1 truncate">
              <span className="font-semibold">{role.name}</span>
              {subtitle && <span className="text-white/60"> · {subtitle}</span>}
            </span>
            {filled && <span className="shrink-0 text-white/60">Filled</span>}
          </div>
        </Collapse>

        <ExpandingDetails expanded={expanded}>
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="font-bold wrap-break-word">{role.name}</h3>
            {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
            <StatusDot tone={role.status === 'Open' ? 'positive' : 'neutral'}>{role.status}</StatusDot>
          </div>

          {role.conceptArt.length > 0 && (
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <span className="min-w-0 truncate">{art?.caption ?? 'Concept art'}</span>
              <span aria-hidden>·</span>
              <span className="shrink-0 tabular-nums">
                {shownIndex + 1} / {role.conceptArt.length}
              </span>
            </p>
          )}

          {role.description && (
            <p className="line-clamp-3 text-center text-sm whitespace-pre-line">{role.description}</p>
          )}

          {factGroups.length > 0 && (
            <div role="group" aria-label="Requirements" className="flex flex-col items-center gap-1.5">
              {factGroups.map((facts) => (
                <ul key={facts[0].label} className="flex flex-wrap justify-center gap-1.5">
                  {facts.map((fact) => (
                    <li key={fact.label}>
                      <Badge variant="outline" title={fact.label}>
                        {fact.countryCode && <CountryFlag code={fact.countryCode} decorative className="h-2.5" />}
                        {fact.value}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          )}

          {footer}
        </ExpandingDetails>
      </ExpandingPanel>
    </article>
  )
}