import type { PagedResult } from '@/types/api'
import type { ChatMessage, Conversation, MessageHistory, UnreadCount } from '@/types/conversation'
import { request, withQuery } from './http'

const conversationsPageSize = 100
const messagesPageSize = 50

export const conversationsApi = {
  list: () =>
    request<PagedResult<Conversation>>(withQuery('/api/conversations', { pageSize: conversationsPageSize })),

  get: (conversationId: string) => request<Conversation>(`/api/conversations/${conversationId}`),

  start: (actorId: string) =>
    request<Conversation>('/api/conversations', { method: 'POST', body: { actorId } }),

  unreadCount: () => request<UnreadCount>('/api/conversations/unread-count'),

  markRead: (conversationId: string) =>
    request<void>(`/api/conversations/${conversationId}/read`, { method: 'POST' }),

  messages: (conversationId: string, before?: string) =>
    request<MessageHistory>(
      withQuery(`/api/conversations/${conversationId}/messages`, { before, limit: messagesPageSize }),
    ),

  send: (conversationId: string, content: string) =>
    request<ChatMessage>(`/api/conversations/${conversationId}/messages`, { method: 'POST', body: { content } }),
}