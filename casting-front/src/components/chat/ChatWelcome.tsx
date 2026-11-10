import { ArrowLeft01Icon, BubbleChatIcon, PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'

type Props = {
  missing: boolean
  onCompose?: () => void
  onBack: () => void
}

export function ChatWelcome({ missing, onCompose, onBack }: Props) {
  const description = onCompose
    ? 'Pick a chat on the left, or start a new one with an actor.'
    : 'Pick a chat on the left. Directors start new chats with actors.'

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-primary/15 text-primary">
        <HugeiconsIcon icon={BubbleChatIcon} strokeWidth={1.5} className="size-10" />
      </span>
      <div className="flex max-w-sm flex-col gap-1">
        <h2 className="text-lg font-semibold">{missing ? 'This chat is not available' : 'Your chats'}</h2>
        <p className="text-sm text-muted-foreground">{missing ? 'It may have been removed.' : description}</p>
      </div>
      {missing && (
        <Button variant="outline" className="md:hidden" onClick={onBack}>
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} data-icon="inline-start" />
          Back to chats
        </Button>
      )}
      {!missing && onCompose && (
        <Button variant="outline" onClick={onCompose}>
          <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} data-icon="inline-start" />
          New message
        </Button>
      )}
    </div>
  )
}