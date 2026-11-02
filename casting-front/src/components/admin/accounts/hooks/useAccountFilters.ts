import { useSearchParams } from 'react-router'
import { parseAccountFilters, toSearchParams, type AccountFilters } from '../filters/account-filters'

type FilterChanges = Partial<Omit<AccountFilters, 'page'>>

export function useAccountFilters() {
  const [params, setParams] = useSearchParams()
  const filters = parseAccountFilters(params)

  const setFilters = (changes: FilterChanges, options?: { replace?: boolean }) =>
    setParams(toSearchParams({ ...filters, ...changes, page: 1 }), options)

  const setPage = (page: number) => setParams(toSearchParams({ ...filters, page }))

  const clearFilters = () => setParams(new URLSearchParams())

  return { filters, setFilters, setPage, clearFilters }
}