import type { MouseEvent } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'

type Props = {
  page: number
  pageCount: number
  hrefFor: (page: number) => string
  onPageChange: (page: number) => void
}

export function visiblePages(current: number, count: number): (number | 'gap')[] {
  const pages = [...new Set([1, current - 1, current, current + 1, count])]
    .filter((page) => page >= 1 && page <= count)
    .sort((a, b) => a - b)

  return pages.flatMap((page, index) =>
    index > 0 && page - pages[index - 1] > 1 ? (['gap', page] as const) : [page],
  )
}

export function ListPagination({ page, pageCount, hrefFor, onPageChange }: Props) {
  if (pageCount <= 1) return null

  const go = (target: number) => (event: MouseEvent) => {
    event.preventDefault()
    onPageChange(target)
  }

  const isFirst = page <= 1
  const isLast = page >= pageCount

  return (
    <Pagination className="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={hrefFor(page - 1)}
            onClick={go(page - 1)}
            aria-disabled={isFirst}
            className={cn(isFirst && 'pointer-events-none opacity-50')}
          />
        </PaginationItem>

        {visiblePages(page, pageCount).map((item, index) =>
          item === 'gap' ? (
            <PaginationItem key={`gap-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink href={hrefFor(item)} onClick={go(item)} isActive={item === page}>
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href={hrefFor(page + 1)}
            onClick={go(page + 1)}
            aria-disabled={isLast}
            className={cn(isLast && 'pointer-events-none opacity-50')}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}