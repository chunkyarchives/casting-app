import { useEffect, useEffectEvent } from 'react'
import { useNavigate } from 'react-router'
import { toast } from '@/components/ui/toast'
import { conversationsApi } from '@/lib/api/conversations'
import { subscribeToChat } from '@/lib/chat/chat-hub'
import { addUnread, chatView, isWatching, refreshUnreadTotal } from '@/lib/chat/chat-unread'
import { rolePath } from '@/lib/routes'
import type { ChatMessage } from '@/types/conversation'
import type { CurrentParticipant } from '@/types/participant'
import { chatPartner, preview } from './chat-format'

const toastTimeoutMs = 6000
const partnerNames = new Map<string, string>()

async function partnerName(conversationId: string, viewerId: string) {
  const known = partnerNames.get(conversationId)
  if (known) return known

  try {
    const name = chatPartner(await conversationsApi.get(conversationId), viewerId).name
    partnerNames.set(conversationId, name)
    return name
  } catch {
    return null
  }
}

export default function ChatNotification({ viewer }: { viewer: CurrentParticipant }) {
  const navigate = useNavigate()
  const chatPath = rolePath(viewer.role, 'chat')

    const announce = async (message: ChatMessage) => {
    const name = await partnerName(message.conversationId, viewer.id)
    const id = toast.add({
      title: name ? `${name} said:` : 'New message',
      description: preview(message.content),
      timeout: toastTimeoutMs,
      actionProps: {
        children: 'Open',
        onClick: () => {
          toast.close(id)
          void navigate(`${chatPath}?chat=${message.conversationId}`)
        },
      },
    })
  }

  const receive = useEffectEvent((message: ChatMessage) => {
    if (message.senderId === viewer.id || isWatching(message.conversationId)) return

    addUnread(1)
    const view = chatView()
    if (!view.open || view.conversationId !== null) void announce(message)
  })

  const reconnected = useEffectEvent(() => void refreshUnreadTotal())

  useEffect(() => {
    void refreshUnreadTotal()
    return subscribeToChat({
      onMessage: (message) => receive(message),
      onReconnected: () => reconnected(),
    })
  }, [])

  return null
}