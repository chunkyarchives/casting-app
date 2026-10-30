import { useEffect, useEffectEvent, useState } from 'react'

export type QueryState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  | { status: 'success'; data: T }

type Settled<T> = {
  key: string
  state: QueryState<T>
}

export function useApiQuery<T>(key: string, load: () => Promise<T>): QueryState<T> {
  const [settled, setSettled] = useState<Settled<T> | null>(null)

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
  }, [key])

  return settled?.key === key ? settled.state : { status: 'loading' }
}