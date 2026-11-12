import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { DragDropProvider, DragOverlay } from '@dnd-kit/react'
import { pendingProposalsKey } from '@/components/application/hooks/usePendingProposals'
import { ActorDragPreview } from '@/components/matchmaking/actors/ActorDragPreview'
import { actorName } from '@/components/matchmaking/actors/actor-facts'
import { ActorPool } from '@/components/matchmaking/actors/ActorPool'
import { actorFilterCodec, actorPoolQuery, matchmakingRolesQuery } from '@/components/matchmaking/matchmaking-queries'
import { RolePool } from '@/components/matchmaking/roles/RolePool'
import { toast } from '@/components/ui/toast'
import { forgetQuery, useApiQuery } from '@/hooks/useApiQuery'
import { useListFilters } from '@/hooks/useListFilters'
import { applicationsApi } from '@/lib/api/applications'
import { crewsApi } from '@/lib/api/crews'
import { apiErrorMessage } from '@/lib/api/errors'
import { ApiError } from '@/lib/api/http'
import { subscribeToApplicationDecisions } from '@/lib/chat/chat-hub'
import { fallInto, returnTo, shake } from '@/lib/motion'
import type { ActorSummary } from '@/types/actor'
import type { MatchmakingRole } from '@/types/film'

const pairKey = (roleId: string, actorId: string) => `${roleId}:${actorId}`

export function CastingDirectorMatchmaking() {
  const { filters, setFilters, setPage } = useListFilters(actorFilterCodec)
  const actorList = actorPoolQuery(filters)
  const actors = useApiQuery(actorList.key, actorList.load, { keepPreviousData: true })
  const roles = useApiQuery(matchmakingRolesQuery.key, matchmakingRolesQuery.load)
  const crews = useApiQuery('matchmaking-crews', () => crewsApi.mine())
  const [proposed, setProposed] = useState<ReadonlySet<string>>(new Set())
  const [dragging, setDragging] = useState(false)
  const landsInRole = useRef(false)

  const pageActors = actors.status === 'success' ? actors.data.items : []
  const openRoles = roles.status === 'success' ? roles.data : []

  const markProposed = (key: string, on: boolean) =>
    setProposed((current) => {
      const next = new Set(current)
      if (on) next.add(key)
      else next.delete(key)
      return next
    })

  const isProposed = (openRole: MatchmakingRole, actorId: string) =>
    openRole.proposedActorIds.includes(actorId) || proposed.has(pairKey(openRole.role.id, actorId))

  const propose = async (actor: ActorSummary, openRole: MatchmakingRole, elements: (Element | null | undefined)[]) => {
    const name = actorName(actor)
    const key = pairKey(openRole.role.id, actor.id)

    if (isProposed(openRole, actor.id)) {
      elements.forEach(shake)
      toast.add({ type: 'warning', title: `${name} is already up for ${openRole.role.name}`, description: openRole.filmTitle })
      return
    }

    markProposed(key, true)
    const created = await applicationsApi.propose(openRole.role.id, actor.id).catch((error: unknown) => {
      const taken = error instanceof ApiError && error.status === 409
      if (!taken) markProposed(key, false)
      elements.forEach(shake)
      toast.add({ type: 'error', title: `${name} could not be proposed`, description: apiErrorMessage(error) })
      return null
    })
    if (!created) return

    forgetQuery(pendingProposalsKey)
    toast.add({ type: 'success', title: `${name} proposed for ${openRole.role.name}`, description: openRole.filmTitle })
  }

  const decided = useEffectEvent(() => {
    setProposed(new Set())
    roles.reload()
  })

  useEffect(() => subscribeToApplicationDecisions({ onApplicationDecided: () => decided() }), [])

  return (
    <DragDropProvider
      onDragStart={() => setDragging(true)}
      onDragEnd={(event) => {
        landsInRole.current = false
        const { source, target } = event.operation
        if (event.canceled || !source || !target) return

        const actor = pageActors.find((item) => item.id === source.id)
        const openRole = openRoles.find((item) => item.role.id === target.id)
        if (!actor || !openRole) return
        landsInRole.current = !isProposed(openRole, actor.id)
        void propose(actor, openRole, [target.element, source.element])
      }}
    >
      <div className="grid min-h-[calc(100svh-3rem)] border-t lg:grid-cols-2">
        <ActorPool
          actors={actors}
          filters={filters}
          hrefFor={(page) => `?${actorFilterCodec.toSearchParams({ ...filters, page })}`}
          onSearch={(search) => setFilters({ search }, { replace: true })}
          onPageChange={setPage}
          locked={dragging}
          className="bg-background px-6 py-6 lg:px-8"
        />
        <RolePool roles={roles} crews={crews} locked={dragging} className="bg-muted/60 px-6 py-6 max-lg:border-t lg:border-l lg:px-8" />
      </div>

      <DragOverlay
        dropAnimation={({ source, element, feedbackElement }) => {
          const hole = source.manager?.dragOperation.target?.element
          const landing = landsInRole.current && hole ? fallInto(feedbackElement, hole) : returnTo(feedbackElement, element)
          return landing.finally(() => setDragging(false))
        }}
      >
        {(source) => {
          const actor = pageActors.find((item) => item.id === source.id)
          return actor ? <ActorDragPreview actor={actor} /> : null
        }}
      </DragOverlay>
    </DragDropProvider>
  )
}