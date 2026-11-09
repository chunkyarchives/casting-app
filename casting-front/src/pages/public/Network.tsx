import { UserGroupIcon } from '@hugeicons/core-free-icons'
import { FilterBar } from '@/components/common/list/FilterBar'
import { SearchField } from '@/components/common/list/SearchField'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { PagedCards } from '@/components/public/PagedCards'
import { PersonCard } from '@/components/public/PersonCard'
import { PublicPage } from '@/components/public/PublicPage'
import { peopleFilterCodec, peopleQuery } from '@/components/public/public-lists'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useListFilters } from '@/hooks/useListFilters'
import { pickKnown } from '@/lib/list-filters'
import { signUpRoles } from '@/types/participant'

const everyone = 'everyone'

const roleOptions = [
  { value: everyone, label: 'Everyone' },
  { value: 'Actor', label: 'Actors' },
  { value: 'Director', label: 'Directors' },
  { value: 'CastingDirector', label: 'Casting directors' },
]

export default function Network() {
  const { filters, hasFilters, setFilters, setPage, clearFilters } = useListFilters(peopleFilterCodec)
  const list = peopleQuery(filters)
  const people = useApiQuery(list.key, list.load, { keepPreviousData: true })

  const hrefFor = (page: number) => `?${peopleFilterCodec.toSearchParams({ ...filters, page })}`

  const selectRole = (next: string[]) => {
    if (next.length > 0) setFilters({ role: pickKnown(signUpRoles, next.slice(-1))[0] ?? null })
  }

  return (
    <PublicPage
      title="Network"
      description="Actors, directors and casting directors who made their profile public. Yours can be here too: turn it on in Settings, under Privacy."
      count={people.status === 'success' ? people.data.totalCount : undefined}
      toolbar={
        <FilterBar canClear={hasFilters} onClear={clearFilters}>
          <SearchField
            value={filters.search}
            onChange={(search) => setFilters({ search }, { replace: true })}
            placeholder="Search by name"
            label="Search people"
          />
          <ToggleGroup
            variant="outline"
            aria-label="Role"
            className="flex-wrap *:aria-pressed:border-primary *:aria-pressed:text-foreground"
            value={[filters.role ?? everyone]}
            onValueChange={selectRole}
          >
            {roleOptions.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </FilterBar>
      }
    >
      <PagedCards
        query={people}
        page={filters.page}
        hrefFor={hrefFor}
        onPageChange={setPage}
        filtered={hasFilters}
        errorTitle="People could not be loaded"
        empty={<EmptyMessage icon={UserGroupIcon} title="No public profiles yet" description="Profiles show up here once their owners make them public." />}
        gridClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        skeletonClassName="h-64"
        renderItem={(person) => <PersonCard person={person} />}
      />
    </PublicPage>
  )
}