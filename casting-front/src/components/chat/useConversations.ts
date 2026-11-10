import { useEffect, useEffectEvent, useState } from 'react'
import { conversationsApi } from '@/lib/api/conversations'
import { subscribeToChat } from '@/lib/chat/chat-hub'
import { refreshUnreadTotal } from '@/lib/chat/chat-unread'
import type { ChatMessage, Conversation } from '@/types/conversation'
import { lastActivity, preview } from './chat-format'

export type ConversationsState =
  | { status: 'loading' }
  | { status: 'error'; error: unknown }
  | { status: 'ready'; items: Conversation[] }

const sortByActivity = (items: Conversation[]) => [...items].sort((a, b) => lastActivity(b) - lastActivity(a))

function withMessage(items: Conversation[], message: ChatMessage, unreadDelta: number) {
  const updated = items.map((conversation) =>
    conversation.id === message.conversationId
      ? {
          ...conversation,
          lastMessage: { senderId: message.senderId, preview: preview(message.content), sentAt: message.sentAt },
          unreadCount: conversation.unreadCount + unreadDelta,
        }
      : conversation,
  )
  return sortByActivity(updated)
}

export function useConversations(viewerId: string) {
  const [state, setState] = useState<ConversationsState>({ status: 'loading' })
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    let ignore = false

    conversationsApi.list().then(
      (result) => {
        if (!ignore) setState({ status: 'ready', items: sortByActivity(result.items) })
      },
      (error: unknown) => {
        if (!ignore) setState({ status: 'error', error })
      },
    )

    return () => {
      ignore = true
    }
  }, [revision])

  const update = (change: (items: Conversation[]) => Conversation[]) => {
    setState((current) => (current.status === 'ready' ? { status: 'ready', items: change(current.items) } : current))
  }

  const noteMessage = (message: ChatMessage) => {
    const unreadDelta = message.senderId === viewerId ? 0 : 1
    update((items) => withMessage(items, message, unreadDelta))
  }

  const receive = useEffectEvent((message: ChatMessage) => {
    if (state.status !== 'ready') return

    if (state.items.some((conversation) => conversation.id === message.conversationId)) noteMessage(message)
    else setRevision((current) => current + 1)
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

  const markRead = (conversationId: string) => {
    update((items) =>
      items.map((conversation) => (conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation)),
    )
    conversationsApi.markRead(conversationId).then(
      () => refreshUnreadTotal(),
      () => {},
    )
  }

  const upsert = (conversation: Conversation) => {
    update((items) => sortByActivity([conversation, ...items.filter((item) => item.id !== conversation.id)]))
  }

  const reload = () => {
    setState({ status: 'loading' })
    setRevision((current) => current + 1)
  }

  return { state, noteMessage, markRead, upsert, reload }
}