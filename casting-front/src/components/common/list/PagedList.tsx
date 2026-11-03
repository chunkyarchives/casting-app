import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { ListPagination } from '@/components/common/list/ListPagination'
import { formatCount } from '@/lib/format'
import type { PagedResult } from '@/types/api'

type Props = {
  page: number
  result: PagedResult<unknown>
  hrefFor: (page: number) => string
  onPageChange: (page: number) => void
  children: ReactNode
}

export function PagedList({ page, result, hrefFor, onPageChange, children }: Props) {
  const pageCount = Math.max(1, Math.ceil(result.totalCount / result.pageSize))

  if (page > pageCount) return <Navigate to={hrefFor(pageCount)} replace />

  const first = (result.page - 1) * result.pageSize + 1
  const last = first + result.items.length - 1

  return (
    <>
      {children}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground tabular-nums">
          {result.totalCount > 0 &&
            `${formatCount(first)}-${formatCount(last)} of ${formatCount(result.totalCount)}`}
        </p>
        <ListPagination page={page} pageCount={pageCount} hrefFor={hrefFor} onPageChange={onPageChange} />
      </div>
    </>
  )
}