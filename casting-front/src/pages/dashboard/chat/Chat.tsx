import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'
import { ChatScreen } from '@/components/chat/ChatScreen'

export default function Chat() {
  const participant = useCurrentParticipant()

  return participant && <ChatScreen viewer={participant} />
}