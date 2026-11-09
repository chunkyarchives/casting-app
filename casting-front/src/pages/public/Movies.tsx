import { Film01Icon } from '@hugeicons/core-free-icons'
import { FilterBar } from '@/components/common/list/FilterBar'
import { SearchField } from '@/components/common/list/SearchField'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { FilmCard } from '@/components/public/FilmCard'
import { PagedCards } from '@/components/public/PagedCards'
import { PublicPage } from '@/components/public/PublicPage'
import { filmFilterCodec, filmsQuery } from '@/components/public/public-lists'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useListFilters } from '@/hooks/useListFilters'

export default function Movies() {
  const { filters, hasFilters, setFilters, setPage, clearFilters } = useListFilters(filmFilterCodec)
  const list = filmsQuery(filters)
  const films = useApiQuery(list.key, list.load, { keepPreviousData: true })

  const hrefFor = (page: number) => `?${filmFilterCodec.toSearchParams({ ...filters, page })}`

  return (
    <PublicPage
      title="Movies"
      description="Films that are casting right now, and the roles they still need to fill."
      count={films.status === 'success' ? films.data.totalCount : undefined}
      toolbar={
        <FilterBar canClear={hasFilters} onClear={clearFilters}>
          <SearchField
            value={filters.search}
            onChange={(search) => setFilters({ search }, { replace: true })}
            placeholder="Search by title"
            label="Search movies"
          />
        </FilterBar>
      }
    >
      <PagedCards
        query={films}
        page={filters.page}
        hrefFor={hrefFor}
        onPageChange={setPage}
        filtered={hasFilters}
        errorTitle="Movies could not be loaded"
        empty={<EmptyMessage icon={Film01Icon} title="No movies yet" description="New films show up here as soon as directors add them." />}
        gridClassName="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        skeletonClassName="aspect-[2/4]"
        renderItem={(film) => <FilmCard film={film} />}
      />
    </PublicPage>
  )
}