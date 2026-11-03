import { useEffect, useEffectEvent, useState } from 'react'

export type QueryState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  | { status: 'success'; data: T }

export type QueryResult<T> = QueryState<T> & {
  stale: boolean
  reload: () => void
}

type Options = {
  keepPreviousData?: boolean
  refresh?: number
}

type Settled<T> = {
  key: string
  state: QueryState<T>
}

const cache = new Map<string, unknown>()
const maxCachedKeys = 100

function remember(key: string, data: unknown) {
  cache.delete(key)
  cache.set(key, data)

  if (cache.size > maxCachedKeys) {
    const oldest = cache.keys().next().value
    if (oldest !== undefined) cache.delete(oldest)
  }
}

export type QuerySpec<T> = {
  key: string
  load: () => Promise<T>
}

const prefetching = new Set<string>()

export function prefetchQuery<T>({ key, load }: QuerySpec<T>) {
  if (cache.has(key) || prefetching.has(key)) return

  prefetching.add(key)
  load()
    .then((data) => remember(key, data))
    .catch(() => {})
    .finally(() => prefetching.delete(key))
}

export function useApiQuery<T>(key: string, load: () => Promise<T>, options: Options = {}): QueryResult<T> {
  const [settled, setSettled] = useState<Settled<T> | null>(null)
  const [revision, setRevision] = useState(0)

  const runLoad = useEffectEvent(load)

  useEffect(() => {
    let ignore = false

    runLoad().then(
      (data) => {
        remember(key, data)
        if (!ignore) setSettled({ key, state: { status: 'success', data } })
      },
      (error: unknown) => {
        if (!ignore) setSettled({ key, state: { status: 'error', error } })
      },
    )

    return () => {
      ignore = true
    }
  }, [key, revision, options.refresh])

  const reload = () => setRevision((current) => current + 1)

  if (settled?.key === key) return { ...settled.state, stale: false, reload }
  if (cache.has(key)) return { status: 'success', data: cache.get(key) as T, stale: false, reload }
  if (options.keepPreviousData && settled?.state.status === 'success') {
    return { ...settled.state, stale: true, reload }
  }
  return { status: 'loading', stale: false, reload }
}