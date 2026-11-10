import { useLayoutEffect, useRef } from 'react'
import { BubbleChatIcon } from '@hugeicons/core-free-icons'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { continuesGroup, dayLabel, messageTime, sameDay } from './chat-format'
import type { ThreadMessage } from './useThread'

const stickToBottomPx = 120
const preloadMargin = '200px 0px 0px 0px'

type Props = {
  messages: ThreadMessage[]
  viewerId: string
  partnerName: string
  hasMore: boolean
  loadingOlder: boolean
  onLoadOlder: () => void
  onRetry: (message: ThreadMessage) => void
  onDiscard: (message: ThreadMessage) => void
}

export function MessageList({
  messages,
  viewerId,
  partnerName,
  hasMore,
  loadingOlder,
  onLoadOlder,
  onRetry,
  onDiscard,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const seen = useRef({ firstId: '', lastId: '', height: 0, top: 0 })

  useLayoutEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const before = seen.current
    const last = messages.at(-1)
    const firstId = messages[0]?.id ?? ''
    const lastId = last?.id ?? ''
    const nearBottom = before.height - before.top - element.clientHeight < stickToBottomPx

    if (before.lastId === '' || (lastId !== before.lastId && (nearBottom || last?.senderId === viewerId))) {
      element.scrollTop = element.scrollHeight
    } else if (firstId !== before.firstId && lastId === before.lastId) {
      element.scrollTop = before.top + element.scrollHeight - before.height
    }

    seen.current = { firstId, lastId, height: element.scrollHeight, top: element.scrollTop }
  }, [messages, viewerId])

  const rememberScroll = () => {
    const element = scrollRef.current
    if (element) seen.current = { ...seen.current, height: element.scrollHeight, top: element.scrollTop }
  }

  const watchTop = (node: HTMLDivElement | null) => {
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onLoadOlder()
      },
      { root: node.parentElement, rootMargin: preloadMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }

  if (messages.length === 0) {
    return (
      <EmptyMessage icon={BubbleChatIcon} title="No messages yet" description={`Say hello to ${partnerName}.`} />
    )
  }

  return (
    <div ref={scrollRef} onScroll={rememberScroll} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
      {hasMore && <div ref={watchTop} className="h-px" />}
      {loadingOlder && (
        <div className="flex justify-center py-2">
          <Spinner className="size-4 text-muted-foreground" />
        </div>
      )}

      <ol role="log" aria-live="polite" aria-label={`Messages with ${partnerName}`} className="flex flex-col">
        {messages.map((message, index) => {
          const previous = messages[index - 1]
          const newDay = previous === undefined || !sameDay(previous.sentAt, message.sentAt)

          return (
            <li key={message.id} className={cn('flex flex-col', continuesGroup(previous, message) ? 'mt-0.5' : 'mt-3')}>
              {newDay && (
                <p className="mb-3 self-center rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {dayLabel(message.sentAt)}
                </p>
              )}
              <MessageBubble
                message={message}
                mine={message.senderId === viewerId}
                onRetry={onRetry}
                onDiscard={onDiscard}
              />
            </li>
          )
        })}
      </ol>
    </div>
  )
}

type BubbleProps = {
  message: ThreadMessage
  mine: boolean
  onRetry: (message: ThreadMessage) => void
  onDiscard: (message: ThreadMessage) => void
}

function MessageBubble({ message, mine, onRetry, onDiscard }: BubbleProps) {
  const sending = message.delivery === 'sending'
  const failed = message.delivery === 'failed'

  return (
    <div className={cn('flex max-w-[min(75%,36rem)] flex-col gap-1', mine ? 'items-end self-end' : 'items-start self-start')}>
      <div
        className={cn(
          'rounded-2xl px-3 py-2 text-sm wrap-break-word whitespace-pre-wrap',
          mine ? 'bg-primary text-primary-foreground' : 'bg-muted',
          sending && 'opacity-60',
          failed && 'ring-2 ring-destructive',
        )}
      >
        {message.content}
        <span className={cn('ml-2 text-[11px] whitespace-nowrap', mine ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
          {sending ? 'Sending…' : messageTime(message.sentAt)}
        </span>
      </div>

      {failed && (
        <p className="flex flex-wrap items-center gap-x-2 text-xs text-destructive">
          {message.problem ?? 'Not sent.'}
          <button type="button" className="font-medium underline underline-offset-2" onClick={() => onRetry(message)}>
            Retry
          </button>
          <button type="button" className="font-medium underline underline-offset-2" onClick={() => onDiscard(message)}>
            Delete
          </button>
        </p>
      )}
    </div>
  )
}