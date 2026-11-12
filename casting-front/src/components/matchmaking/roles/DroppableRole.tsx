import { useDroppable } from '@dnd-kit/react'
import { RoleCard } from '@/components/film/shared/RoleCard'
import type { MatchmakingRole } from '@/types/film'

type Props = {
  openRole: MatchmakingRole
  locked: boolean
}

export function DroppableRole({ openRole, locked }: Props) {
  const { ref, isDropTarget } = useDroppable({ id: openRole.role.id, accept: 'actor' })

  return (
    <RoleCard
      ref={ref}
      role={openRole.role}
      subtitle={openRole.filmTitle}
      dropTarget={isDropTarget}
      locked={locked}
    />
  )
}