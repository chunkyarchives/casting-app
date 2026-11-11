import { useEffect, useEffectEvent, useState } from 'react'
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { ActorInfoSheet } from '@/components/chat/profile/ActorInfoSheet'
import { DirectorInfoSheet } from '@/components/chat/profile/DirectorInfoSheet'
import { ProfileAvatar } from '@/components/common/media/ProfileAvatar'
import { LoadError } from '@/components/common/states/LoadError'
import { PageLoader } from '@/components/common/states/PageLoader'
import { Button } from '@/components/ui/button'
import { roleLabels } from '@/lib/roles'
import type { ChatMessage, Conversation } from '@/types/conversation'
import { chatPartner } from './chat-format'
import { MessageComposer } from './MessageComposer'
import { MessageList } from './MessageList'
import { useThread } from './useThread'

type Props = {
  conversation: Conversation
  viewerId: string
  onBack: () => void
  onSent: (message: ChatMessage) => void
  onRead: (conversationId: string) => void
}

export function ChatThread({ conversation, viewerId, onBack, onSent, onRead }: Props) {
  const partner = chatPartner(conversation, viewerId)
  const thread = useThread(conversation.id, viewerId, onSent)
  const [profileOpen, setProfileOpen] = useState(false)

  const unread = conversation.unreadCount
  const read = useEffectEvent(() => onRead(conversation.id))

  useEffect(() => {
    if (unread === 0) return

    const readIfVisible = () => {
      if (document.visibilityState === 'visible') read()
    }

    readIfVisible()
    document.addEventListener('visibilitychange', readIfVisible)
    return () => document.removeEventListener('visibilitychange', readIfVisible)
  }, [unread])

  const identity = (
    <>
      <ProfileAvatar participantId={partner.id} className="size-9 shrink-0" />
      <span className="flex min-w-0 flex-col text-left">
        <span className="truncate leading-tight font-semibold">{partner.name}</span>
        <span className="text-xs text-muted-foreground">{roleLabels[partner.role]}</span>
      </span>
    </>
  )

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-3 border-b px-3">
        <Button variant="ghost" size="icon" aria-label="Back to chats" className="md:hidden" onClick={onBack}>
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        </Button>
        <button
          type="button"
          aria-label={`Show the profile of ${partner.name}`}
          onClick={() => setProfileOpen(true)}
          className="-mx-2 flex min-w-0 items-center gap-3 rounded-2xl px-2 py-1 transition-colors hover:bg-accent"
        >
          {identity}
        </button>
      </header>

      {thread.state.status === 'loading' && <PageLoader />}

      {thread.state.status === 'error' && (
        <LoadError title="Messages could not be loaded" error={thread.state.error} onRetry={thread.reload} />
      )}

      {thread.state.status === 'ready' && (
        <MessageList
          messages={thread.state.messages}
          viewerId={viewerId}
          partnerName={partner.name}
          hasMore={thread.state.hasMore}
          loadingOlder={thread.loadingOlder}
          onLoadOlder={() => void thread.loadOlder()}
          onRetry={thread.retry}
          onDiscard={thread.discard}
        />
      )}

      <MessageComposer onSend={thread.send} disabled={thread.state.status !== 'ready'} />

      {partner.role === 'Director' ? (
        <DirectorInfoSheet directorId={partner.id} name={partner.name} open={profileOpen} onOpenChange={setProfileOpen} />
      ) : (
        <ActorInfoSheet actorId={partner.id} name={partner.name} open={profileOpen} onOpenChange={setProfileOpen} />
      )}
    </>
  )
}