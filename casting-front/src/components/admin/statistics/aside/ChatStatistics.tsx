import { ConversationIcon } from '@hugeicons/core-free-icons'
import { formatCount } from '@/lib/format'
import type { ChatStats } from '@/types/admin'
import { StatAside } from './StatAside'

type Props = {
  chat: ChatStats
}

export function ChatStatistics({ chat }: Props) {
  return (
    <StatAside
      icon={ConversationIcon}
      title="Chat"
      items={[
        { label: 'Conversations', value: formatCount(chat.conversations) },
        { label: 'Messages', value: formatCount(chat.messages) },
      ]}
    />
  )
}