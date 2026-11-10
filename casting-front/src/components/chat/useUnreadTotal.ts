import { useSyncExternalStore } from 'react'
import { subscribeToUnread, unreadTotal } from '@/lib/chat/chat-unread'

export const useUnreadTotal = () => useSyncExternalStore(subscribeToUnread, unreadTotal)