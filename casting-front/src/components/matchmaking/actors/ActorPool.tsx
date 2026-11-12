import { UserSearch01Icon } from '@hugeicons/core-free-icons'
import { SectionTitle } from '@/components/common/display/SectionTitle'
import { SearchField } from '@/components/common/list/SearchField'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { matchmakingGridClass } from '@/components/matchmaking/matchmaking-layout'
import type { ActorFilters } from '@/components/matchmaking/matchmaking-queries'
import { PagedCards } from '@/components/public/PagedCards'
import type { QueryResult } from '@/hooks/useApiQuery'
import { cn } from '@/lib/utils'
import type { ActorSummary } from '@/types/actor'
import type { PagedResult } from '@/types/api'
import { ActorCard } from './ActorCard'

type Props = {
  actors: QueryResult<PagedResult<ActorSummary>>
  filters: ActorFilters
  hrefFor: (page: number) => string
  onSearch: (search: string) => void
  onPageChange: (page: number) => void
  locked: boolean
  className?: string
}

export function ActorPool({ actors, filters, hrefFor, onSearch, onPageChange, locked, className }: Props) {
  return (
    <section aria-labelledby="matchmaking-actors" className={cn('flex flex-col gap-6', className)}>
      <SectionTitle id="matchmaking-actors">Actors</SectionTitle>
      <SearchField value={filters.search} onChange={onSearch} placeholder="Search actors by name" label="Search actors" />

      <PagedCards
        query={actors}
        page={filters.page}
        hrefFor={hrefFor}
        onPageChange={onPageChange}
        filtered={filters.search !== ''}
        errorTitle="Actors could not be loaded"
        empty={
          <EmptyMessage
            icon={UserSearch01Icon}
            title="No actors yet"
            description="Actors show up here once they finish their profile."
          />
        }
        gridClassName={matchmakingGridClass}
        skeletonClassName="aspect-[5/6] rounded-2xl"
        renderItem={(actor) => <ActorCard actor={actor} locked={locked} />}
      />
    </section>
  )
}