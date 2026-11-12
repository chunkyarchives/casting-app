import { MaskTheater01Icon, UserGroupIcon } from '@hugeicons/core-free-icons'
import { Link } from 'react-router'
import { CardSkeleton } from '@/components/common/cards/CardSkeleton'
import { Marquee } from '@/components/common/display/Marquee'
import { SectionTitle } from '@/components/common/display/SectionTitle'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { LoadError } from '@/components/common/states/LoadError'
import { matchmakingGridClass } from '@/components/matchmaking/matchmaking-layout'
import { buttonVariants } from '@/components/ui/button'
import type { QueryResult } from '@/hooks/useApiQuery'
import { rolePath } from '@/lib/routes'
import { cn } from '@/lib/utils'
import type { Crew } from '@/types/crew'
import type { MatchmakingRole } from '@/types/film'
import { DroppableRole } from './DroppableRole'

type Props = {
  roles: QueryResult<MatchmakingRole[]>
  crews: QueryResult<Crew[]>
  locked: boolean
  className?: string
}

const placeholders = Array.from({ length: 4 }, (_, index) => index)

export function RolePool({ roles, crews, locked, className }: Props) {
  const productions = crews.status === 'success' ? crews.data.map((crew) => crew.productionName).join(' · ') : null
  const noCrew = crews.status === 'success' && crews.data.length === 0

  return (
    <section aria-labelledby="matchmaking-roles" className={cn('flex flex-col gap-6', className)}>
      <SectionTitle id="matchmaking-roles" aside={productions && <Marquee>{productions}</Marquee>}>
        Roles
      </SectionTitle>

      {noCrew && (
        <EmptyMessage
          icon={UserGroupIcon}
          title="You're not in a crew yet"
          description="Join a director's crew with their production code to see the roles you can cast."
        >
          <Link to={rolePath('CastingDirector', 'crew')} className={buttonVariants({ variant: 'outline' })}>
            Join a crew
          </Link>
        </EmptyMessage>
      )}

      {!noCrew && roles.status === 'loading' && (
        <ul aria-hidden className={cn('grid', matchmakingGridClass)}>
          {placeholders.map((index) => (
            <li key={index}>
              <CardSkeleton />
            </li>
          ))}
        </ul>
      )}
      {!noCrew && roles.status === 'error' && (
        <LoadError title="Roles could not be loaded" error={roles.error} onRetry={roles.reload} />
      )}
      {!noCrew && roles.status === 'success' && roles.data.length === 0 && (
        <EmptyMessage
          icon={MaskTheater01Icon}
          title="No open roles right now"
          description="When the directors you work with add roles, they show up here."
        />
      )}
      {!noCrew && roles.status === 'success' && roles.data.length > 0 && (
        <ul className={cn('grid', matchmakingGridClass)}>
          {roles.data.map((openRole) => (
            <li key={openRole.role.id}>
              <DroppableRole openRole={openRole} locked={locked} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}