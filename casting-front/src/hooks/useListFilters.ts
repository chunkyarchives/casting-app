import { useSearchParams } from 'react-router'

type ListFilters = { page: number }

export type FilterCodec<T extends ListFilters> = {
  parse: (params: URLSearchParams) => T
  toSearchParams: (filters: T) => URLSearchParams
}

export function useListFilters<T extends ListFilters>({ parse, toSearchParams }: FilterCodec<T>) {
  const [params, setParams] = useSearchParams()
  const filters = parse(params)

  const setFilters = (changes: Partial<Omit<T, 'page'>>, options?: { replace?: boolean }) =>
    setParams(toSearchParams({ ...filters, ...changes, page: 1 }), options)

  const setPage = (page: number) => setParams(toSearchParams({ ...filters, page }))

  const clearFilters = () => setParams(new URLSearchParams())

  const hasFilters = toSearchParams({ ...filters, page: 1 }).toString() !== ''

  return { filters, hasFilters, setFilters, setPage, clearFilters }
}