import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { PageLoader } from '@/components/common/states/PageLoader'
import { setChatView } from '@/lib/chat/chat-unread'
import { cn } from '@/lib/utils'
import type { Conversation } from '@/types/conversation'
import type { CurrentParticipant } from '@/types/participant'
import { ChatThread } from './ChatThread'
import { ChatWelcome } from './ChatWelcome'
import { ConversationList } from './ConversationList'
import { NewChatDialog } from './NewChatDialog'
import { useConversations } from './useConversations'

const openParam = 'chat'

export function ChatScreen({ viewer }: { viewer: CurrentParticipant }) {
  const [params, setParams] = useSearchParams()
  const openId = params.get(openParam)
  const { state, noteMessage, markRead, upsert, reload } = useConversations(viewer.id)
  const [composing, setComposing] = useState(false)

  useEffect(() => {
    setChatView({ open: true, conversationId: openId })
    return () => setChatView({ open: false, conversationId: null })
  }, [openId])

  const isDirector = viewer.role === 'Director'
  const conversation = state.status === 'ready' ? state.items.find((item) => item.id === openId) : undefined

  const open = (conversationId: string | null) => setParams(conversationId ? { [openParam]: conversationId } : {})

  const started = (next: Conversation) => {
    upsert(next)
    setComposing(false)
    open(next.id)
  }

  const compose = isDirector ? () => setComposing(true) : undefined

  return (
    <div data-slot="chat-screen" className="flex h-[calc(100svh-3rem)] min-h-0 border-t">
      <aside className={cn('flex w-full min-w-0 flex-col md:w-80 md:shrink-0 md:border-r', openId && 'max-md:hidden')}>
        <ConversationList
          viewerId={viewer.id}
          state={state}
          openId={openId}
          onOpen={open}
          onCompose={compose}
          onRetry={reload}
        />
      </aside>

      <section className={cn('flex min-w-0 flex-1 flex-col', !openId && 'max-md:hidden')}>
        {conversation && (
          <ChatThread
            key={conversation.id}
            conversation={conversation}
            viewerId={viewer.id}
            onBack={() => open(null)}
            onSent={noteMessage}
            onRead={markRead}
          />
        )}
        {!conversation && openId && state.status === 'loading' && <PageLoader />}
        {!conversation && (!openId || state.status !== 'loading') && (
          <ChatWelcome missing={openId !== null} onCompose={compose} onBack={() => open(null)} />
        )}
      </section>

      {isDirector && <NewChatDialog open={composing} onOpenChange={setComposing} onStarted={started} />}
    </div>
  )
}