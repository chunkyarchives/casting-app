import { conversationsApi } from '@/lib/api/conversations'

type ChatView = {
  open: boolean
  conversationId: string | null
}

const listeners = new Set<() => void>()

let total = 0
let view: ChatView = { open: false, conversationId: null }

export const unreadTotal = () => total

export function subscribeToUnread(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function setUnreadTotal(next: number) {
  const value = Math.max(0, next)
  if (value === total) return

  total = value
  listeners.forEach((listener) => listener())
}

export const addUnread = (count: number) => setUnreadTotal(total + count)

export const refreshUnreadTotal = () =>
  conversationsApi.unreadCount().then(
    (result) => setUnreadTotal(result.count),
    () => {},
  )

export const chatView = () => view

export function setChatView(next: ChatView) {
  view = next
}

export const isWatching = (conversationId: string) =>
  view.conversationId === conversationId && document.visibilityState === 'visible'