import { useRef, useState, type FocusEvent, type PointerEvent, type ReactNode } from 'react'
import { CountryFlag } from '@/components/common/display/CountryFlag'
import { StatusDot } from '@/components/common/display/StatusDot'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { FilmRole } from '@/types/film'
import { ConceptArtCarousel } from './ConceptArtCarousel'
import { roleFacts } from './role-facts'

type Props = {
  role: FilmRole
  action?: ReactNode
}

export function RoleCard({ role, action }: Props) {
  const pointer = useRef<string | null>(null)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [opened, setOpened] = useState(false)
  const [index, setIndex] = useState(0)
  const expanded = hovered || focused
  const shownIndex = Math.min(index, Math.max(role.conceptArt.length - 1, 0))
  const art = role.conceptArt.at(shownIndex)
  const factGroups = roleFacts(role)

  const enter = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return
    setHovered(true)
    setOpened(true)
  }

  const leave = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') setHovered(false)
  }

  const focus = (event: FocusEvent<HTMLElement>) => {
    if (!event.target.matches(':focus-visible') && pointer.current !== 'touch') return
    setFocused(true)
    setOpened(true)
  }

  const blur = (event: FocusEvent<HTMLElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return
    pointer.current = null
    setFocused(false)
  }

  return (
    <article
      tabIndex={0}
      aria-label={role.name}
      onPointerDown={(event) => {
        pointer.current = event.pointerType
      }}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onFocus={focus}
      onBlur={blur}
      className="relative aspect-square rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <div
        className={cn(
          'absolute top-0 left-1/2 w-full -translate-x-1/2 overflow-hidden rounded-2xl border bg-card shadow-sm transition-[width,translate,box-shadow] duration-200 ease-out motion-reduce:transition-none',
          expanded && 'z-30 w-[calc(100%+2.5rem)] -translate-y-5 shadow-2xl ring-1 ring-primary/40',
        )}
      >
        <div className="relative">
          <ConceptArtCarousel
            items={role.conceptArt}
            roleName={role.name}
            index={shownIndex}
            onIndexChange={setIndex}
            controls={expanded}
            loadAll={opened}
          />

          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-linear-to-t from-black/85 via-black/45 to-transparent px-3 pt-10 pb-2.5 text-white transition-opacity duration-200',
              expanded && 'opacity-0',
            )}
          >
            <span className="truncate font-bold">{role.name}</span>
            {role.status === 'Filled' && <span className="shrink-0 text-xs text-white/75">Filled</span>}
          </div>

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

        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none',
            expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="min-w-0 font-bold wrap-break-word">{role.name}</h3>
                <StatusDot tone={role.status === 'Open' ? 'positive' : 'neutral'}>{role.status}</StatusDot>
              </div>

              {role.conceptArt.length > 0 && (
                <p className="grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs text-muted-foreground">
                  <span className="col-start-2 truncate text-center">{art?.caption ?? 'Concept art'}</span>
                  <span className="text-right tabular-nums">
                    {shownIndex + 1} / {role.conceptArt.length}
                  </span>
                </p>
              )}

              {role.description && <p className="line-clamp-3 text-sm whitespace-pre-line">{role.description}</p>}

              {factGroups.length > 0 && (
                  <div role="group" aria-label="Requirements" className="flex flex-col gap-1.5">
                    {factGroups.map((facts) => (
                      <ul key={facts[0].label} className="flex flex-wrap gap-1.5">
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
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}