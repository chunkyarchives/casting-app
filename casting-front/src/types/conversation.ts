export type ChatMessage = {
  id: string
  conversationId: string
  senderId: string
  content: string
  sentAt: string
}

export type LastMessage = {
  senderId: string
  preview: string
  sentAt: string
}

export type Conversation = {
  id: string
  actorId: string
  actorName: string
  directorId: string
  directorName: string
  createdAt: string
  lastMessage: LastMessage | null
  unreadCount: number
}

export type MessageHistory = {
  items: ChatMessage[]
  hasMore: boolean
  nextBefore: string | null
}

export type UnreadCount = {
  count: number
}
