import { useEffect, useEffectEvent, useState } from 'react'
import { toast } from '@/components/ui/toast'
import { conversationsApi } from '@/lib/api/conversations'
import { apiErrorMessage } from '@/lib/api/errors'
import { ApiError } from '@/lib/api/http'
import { subscribeToChat } from '@/lib/chat/chat-hub'
import type { ChatMessage } from '@/types/conversation'
import { timeOf } from './chat-format'

export type ThreadMessage = ChatMessage & {
  delivery?: 'sending' | 'failed'
  problem?: string
}

type ThreadState =
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  | { status: 'ready'; messages: ThreadMessage[]; hasMore: boolean; nextBefore: string | null }

let localCount = 0

const byTime = (a: ThreadMessage, b: ThreadMessage) => timeOf(a.sentAt) - timeOf(b.sentAt) || a.id.localeCompare(b.id)

function merge(current: ThreadMessage[], incoming: ChatMessage[]) {
  const known = new Set(current.map((message) => message.id))
  const confirmed = current.filter((message) => message.delivery === undefined)
  const pending = current.filter((message) => message.delivery !== undefined)
  const added = incoming.filter((message) => !known.has(message.id))
  return [...[...confirmed, ...added].sort(byTime), ...pending]
}

export function useThread(conversationId: string, viewerId: string, onSent: (message: ChatMessage) => void) {
  const [state, setState] = useState<ThreadState>({ status: 'loading' })
  const [loadingOlder, setLoadingOlder] = useState(false)
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    let ignore = false

    conversationsApi.messages(conversationId).then(
      (history) => {
        if (ignore) return
        setState((current) =>
          current.status === 'ready'
            ? { ...current, messages: merge(current.messages, history.items) }
            : { status: 'ready', messages: merge([], history.items), hasMore: history.hasMore, nextBefore: history.nextBefore },
        )
      },
      (error: unknown) => {
        if (!ignore) setState({ status: 'error', error })
      },
    )

    return () => {
      ignore = true
    }
  }, [conversationId, revision])

  const update = (change: (messages: ThreadMessage[]) => ThreadMessage[]) => {
    setState((current) => (current.status === 'ready' ? { ...current, messages: change(current.messages) } : current))
  }

  const receive = useEffectEvent((message: ChatMessage) => {
    if (message.conversationId !== conversationId) return

    update((messages) => {
      const echo =
        message.senderId === viewerId
          ? messages.find((local) => local.delivery === 'sending' && local.content === message.content)
          : undefined
      return merge(echo ? messages.filter((local) => local !== echo) : messages, [message])
    })
  })

  const reconnected = useEffectEvent(() => setRevision((current) => current + 1))

  useEffect(
    () =>
      subscribeToChat({
        onMessage: (message) => receive(message),
        onReconnected: () => reconnected(),
      }),
    [],
  )

  const deliver = async (local: ThreadMessage) => {
    try {
      const sent = await conversationsApi.send(conversationId, local.content)
      update((messages) => merge(messages.filter((message) => message.id !== local.id), [sent]))
      onSent(sent)
    } catch (error) {
      const problem = error instanceof ApiError && error.detail ? error.detail : apiErrorMessage(error)
      update((messages) =>
        messages.map((message) => (message.id === local.id ? { ...message, delivery: 'failed', problem } : message)),
      )
    }
  }

  const send = (content: string) => {
    localCount += 1
    const local: ThreadMessage = {
      id: `local-${localCount}`,
      conversationId,
      senderId: viewerId,
      content,
      sentAt: new Date().toISOString(),
      delivery: 'sending',
    }

    update((messages) => [...messages, local])
    void deliver(local)
  }

  const retry = (local: ThreadMessage) => {
    update((messages) =>
      messages.map((message) => (message.id === local.id ? { ...message, delivery: 'sending', problem: undefined } : message)),
    )
    void deliver(local)
  }

  const discard = (local: ThreadMessage) => update((messages) => messages.filter((message) => message.id !== local.id))

  const loadOlder = async () => {
    if (state.status !== 'ready' || !state.hasMore || state.nextBefore === null || loadingOlder) return

    setLoadingOlder(true)
    try {
      const history = await conversationsApi.messages(conversationId, state.nextBefore)
      setState((current) =>
        current.status === 'ready'
          ? { status: 'ready', messages: merge(current.messages, history.items), hasMore: history.hasMore, nextBefore: history.nextBefore }
          : current,
      )
    } catch (error) {
      toast.add({ type: 'error', title: 'Older messages could not be loaded', description: apiErrorMessage(error) })
    }
    setLoadingOlder(false)
  }

  const reload = () => {
    setState({ status: 'loading' })
    setRevision((current) => current + 1)
  }

  return { state, loadingOlder, send, retry, discard, loadOlder, reload }
}