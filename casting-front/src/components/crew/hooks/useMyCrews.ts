import { useEffect, useState } from 'react'
import { crewsApi } from '@/lib/api/crews'
import { subscribeToCrew } from '@/lib/chat/chat-hub'
import type { Crew } from '@/types/crew'

type CrewsState =
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  | { status: 'ready'; crews: Crew[] }

export function useMyCrews() {
  const [state, setState] = useState<CrewsState>({ status: 'loading' })
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    let ignore = false

    crewsApi.mine().then(
      (crews) => {
        if (!ignore) setState({ status: 'ready', crews })
      },
      (error: unknown) => {
        if (!ignore) setState((current) => (current.status === 'ready' ? current : { status: 'error', error }))
      },
    )

    return () => {
      ignore = true
    }
  }, [revision])

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') setRevision((current) => current + 1)
    }

    document.addEventListener('visibilitychange', refreshWhenVisible)
    return () => document.removeEventListener('visibilitychange', refreshWhenVisible)
  }, [])

  useEffect(() => {
    const refresh = () => setRevision((current) => current + 1)
    return subscribeToCrew({ onCrewChange: refresh, onReconnected: refresh })
  }, [])

  const update = (change: (crews: Crew[]) => Crew[]) => {
    setState((current) => (current.status === 'ready' ? { status: 'ready', crews: change(current.crews) } : current))
    setRevision((current) => current + 1)
  }

  const reload = () => {
    setState({ status: 'loading' })
    setRevision((current) => current + 1)
  }

  return { state, update, reload }
}