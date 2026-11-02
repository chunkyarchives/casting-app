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
}

type Settled<T> = {
  key: string
  state: QueryState<T>
}

export function useApiQuery<T>(key: string, load: () => Promise<T>, options: Options = {}): QueryResult<T> {
  const [settled, setSettled] = useState<Settled<T> | null>(null)
  const [revision, setRevision] = useState(0)

  const runLoad = useEffectEvent(load)

  useEffect(() => {
    let ignore = false

    runLoad().then(
      (data) => {
        if (!ignore) setSettled({ key, state: { status: 'success', data } })
      },
      (error: unknown) => {
        if (!ignore) setSettled({ key, state: { status: 'error', error } })
      },
    )

    return () => {
      ignore = true
    }
  }, [key, revision])

  const reload = () => setRevision((current) => current + 1)

  if (settled?.key === key) return { ...settled.state, stale: false, reload }
  if (options.keepPreviousData && settled?.state.status === 'success') {
    return { ...settled.state, stale: true, reload }
  }
  return { status: 'loading', stale: false, reload }
}