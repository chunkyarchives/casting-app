import { useState } from 'react'
import { BubbleChatIcon, PencilEdit02Icon, WifiDisconnected01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { SearchField } from '@/components/common/list/SearchField'
import { ProfileAvatar } from '@/components/common/media/ProfileAvatar'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { LoadError } from '@/components/common/states/LoadError'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useDelay } from '@/hooks/useDelay'
import { cn } from '@/lib/utils'
import type { Conversation } from '@/types/conversation'
import { chatPartner, listTime, unreadLabel } from './chat-format'
import { useChatStatus } from './useChatStatus'
import type { ConversationsState } from './useConversations'

const placeholderDelayMs = 300
const placeholderRows = 6

type Props = {
  viewerId: string
  state: ConversationsState
  openId: string | null
  onOpen: (conversationId: string) => void
  onCompose?: () => void
  onRetry: () => void
}

export function ConversationList({ viewerId, state, openId, onOpen, onCompose, onRetry }: Props) {
  const [filter, setFilter] = useState('')
  const status = useChatStatus()

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 px-4">
        <h1 className="text-xl font-semibold">Chats</h1>
        {onCompose && (
          <Button variant="ghost" size="icon" aria-label="New message" onClick={onCompose}>
            <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} />
          </Button>
        )}
      </header>

      <div className="flex shrink-0 flex-col gap-2 px-3 pb-2">
        <SearchField value={filter} onChange={setFilter} placeholder="Search" label="Search chats" />
        {status === 'offline' && (
          <p className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
            <HugeiconsIcon icon={WifiDisconnected01Icon} strokeWidth={2} className="size-3.5" />
            Offline, reconnecting…
          </p>
        )}
      </div>

      {state.status === 'loading' && <ListPlaceholder />}

      {state.status === 'error' && (
        <LoadError title="Chats could not be loaded" error={state.error} onRetry={onRetry} />
      )}

      {state.status === 'ready' && (
        <Conversations
          items={state.items}
          filter={filter.toLowerCase()}
          viewerId={viewerId}
          openId={openId}
          onOpen={onOpen}
          emptyHint={
            onCompose ? 'Start one with the pencil above.' : 'When a director writes to you, the chat shows up here.'
          }
        />
      )}
    </>
  )
}

type ConversationsProps = {
  items: Conversation[]
  filter: string
  viewerId: string
  openId: string | null
  onOpen: (conversationId: string) => void
  emptyHint: string
}

function Conversations({ items, filter, viewerId, openId, onOpen, emptyHint }: ConversationsProps) {
  if (items.length === 0) return <EmptyMessage icon={BubbleChatIcon} title="No chats yet" description={emptyHint} />

  const visible = items.filter((conversation) => chatPartner(conversation, viewerId).name.toLowerCase().includes(filter))
  if (visible.length === 0) return <p className="px-4 py-6 text-center text-sm text-muted-foreground">No chats match your search.</p>

  return (
    <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
      {visible.map((conversation) => (
        <li key={conversation.id}>
          <ConversationItem
            conversation={conversation}
            viewerId={viewerId}
            active={conversation.id === openId}
            onOpen={onOpen}
          />
        </li>
      ))}
    </ul>
  )
}

type ItemProps = {
  conversation: Conversation
  viewerId: string
  active: boolean
  onOpen: (conversationId: string) => void
}

function ConversationItem({ conversation, viewerId, active, onOpen }: ItemProps) {
  const partner = chatPartner(conversation, viewerId)
  const last = conversation.lastMessage
  const unread = active ? 0 : conversation.unreadCount
  const preview = last ? `${last.senderId === viewerId ? 'You: ' : ''}${last.preview}` : 'No messages yet'

  return (
    <button
      type="button"
      aria-current={active || undefined}
      onClick={() => onOpen(conversation.id)}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl px-2.5 py-2.5 text-left transition-colors hover:bg-accent',
        active && 'bg-accent',
      )}
    >
      <ProfileAvatar participantId={partner.id} className="size-12 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate font-semibold">{partner.name}</span>
          <span className={cn('shrink-0 text-xs text-muted-foreground', unread > 0 && 'font-semibold text-primary')}>
            {listTime(last?.sentAt ?? conversation.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p className={cn('line-clamp-2 flex-1 text-sm text-muted-foreground', unread > 0 && 'text-foreground')}>{preview}</p>
          {unread > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground tabular-nums">
              {unreadLabel(unread)}
              <span className="sr-only"> unread</span>
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function ListPlaceholder() {
  const slow = useDelay(placeholderDelayMs)

  return (
    <ul aria-hidden="true" className="flex flex-col px-2">
      {slow &&
        Array.from({ length: placeholderRows }, (_, index) => (
          <li key={index} className="flex items-center gap-3 px-2.5 py-2.5">
            <Skeleton className="size-12 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </li>
        ))}
    </ul>
  )
}