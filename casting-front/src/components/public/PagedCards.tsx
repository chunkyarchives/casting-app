import type { ReactNode } from 'react'
import { PagedList } from '@/components/common/list/PagedList'
import { LoadError } from '@/components/common/states/LoadError'
import { NoResults } from '@/components/common/states/NoResults'
import type { QueryResult } from '@/hooks/useApiQuery'
import type { PagedResult } from '@/types/api'
import { CardGrid, CardGridSkeleton } from './CardGrid'

type Props<T> = {
  query: QueryResult<PagedResult<T>>
  page: number
  hrefFor: (page: number) => string
  onPageChange: (page: number) => void
  filtered: boolean
  errorTitle: string
  empty: ReactNode
  gridClassName: string
  skeletonClassName: string
  renderItem: (item: T) => ReactNode
}

export function PagedCards<T extends { id: string }>({
  query,
  page,
  hrefFor,
  onPageChange,
  filtered,
  errorTitle,
  empty,
  gridClassName,
  skeletonClassName,
  renderItem,
}: Props<T>) {
  if (query.status === 'loading') return <CardGridSkeleton className={gridClassName} itemClassName={skeletonClassName} />
  if (query.status === 'error') return <LoadError title={errorTitle} error={query.error} onRetry={query.reload} />
  if (query.data.totalCount === 0) return filtered ? <NoResults /> : empty

  return (
    <PagedList page={page} result={query.data} hrefFor={hrefFor} onPageChange={onPageChange}>
      <CardGrid className={gridClassName} stale={query.stale}>
        {query.data.items.map((item) => (
          <li key={item.id}>{renderItem(item)}</li>
        ))}
      </CardGrid>
    </PagedList>
  )
}