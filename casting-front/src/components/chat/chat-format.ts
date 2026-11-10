import { differenceInCalendarDays, format, isThisYear, isToday, isYesterday, parseISO } from 'date-fns'
import type { ChatMessage, Conversation } from '@/types/conversation'
import type { ParticipantRole } from '@/types/participant'

export type ChatPartner = {
  id: string
  name: string
  role: ParticipantRole
}

export const chatPartner = (conversation: Conversation, viewerId: string): ChatPartner =>
  viewerId === conversation.actorId
    ? { id: conversation.directorId, name: conversation.directorName, role: 'Director' }
    : { id: conversation.actorId, name: conversation.actorName, role: 'Actor' }

export const timeOf = (iso: string) => parseISO(iso).getTime()

export const lastActivity = (conversation: Conversation) =>
  timeOf(conversation.lastMessage?.sentAt ?? conversation.createdAt)

export function listTime(iso: string) {
  const date = parseISO(iso)
  if (isToday(date)) return format(date, 'HH:mm')
  if (isYesterday(date)) return 'Yesterday'
  if (differenceInCalendarDays(new Date(), date) < 7) return format(date, 'EEE')
  return format(date, isThisYear(date) ? 'd MMM' : 'd MMM yyyy')
}

export function dayLabel(iso: string) {
  const date = parseISO(iso)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, isThisYear(date) ? 'EEEE, d MMMM' : 'd MMMM yyyy')
}

export const messageTime = (iso: string) => format(parseISO(iso), 'HH:mm')

export const sameDay = (a: string, b: string) => differenceInCalendarDays(parseISO(a), parseISO(b)) === 0

const groupGapMs = 5 * 60 * 1000

export const continuesGroup = (previous: ChatMessage | undefined, message: ChatMessage) =>
  previous !== undefined &&
  previous.senderId === message.senderId &&
  sameDay(previous.sentAt, message.sentAt) &&
  timeOf(message.sentAt) - timeOf(previous.sentAt) < groupGapMs

const previewLength = 140

export const preview = (content: string) =>
  content.length <= previewLength ? content : `${content.slice(0, previewLength)}…`

export const unreadLabel = (count: number) => (count > 99 ? '99+' : String(count))