import { useSyncExternalStore } from 'react'
import { chatStatus, subscribeToChatStatus } from '@/lib/chat/chat-hub'

export const useChatStatus = () => useSyncExternalStore(subscribeToChatStatus, chatStatus)