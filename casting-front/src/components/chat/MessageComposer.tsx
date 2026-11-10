import { useState } from 'react'
import { SentIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const maxLength = 2000
const counterFrom = 1800

type Props = {
  onSend: (content: string) => void
  disabled?: boolean
}

export function MessageComposer({ onSend, disabled = false }: Props) {
  const [text, setText] = useState('')
  const content = text.trim()

  const submit = () => {
    if (disabled || content.length === 0) return
    onSend(content)
    setText('')
  }

  return (
    <form
      className="flex shrink-0 items-end gap-2 border-t p-3"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Textarea
          value={text}
          rows={1}
          maxLength={maxLength}
          placeholder="Message"
          aria-label="Message"
          disabled={disabled}
          className="max-h-40 min-h-10 py-2"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return
            event.preventDefault()
            submit()
          }}
        />
        {text.length >= counterFrom && (
          <p className="px-3 text-right text-xs text-muted-foreground tabular-nums">
            {text.length} / {maxLength}
          </p>
        )}
      </div>
      <Button type="submit" size="icon-lg" aria-label="Send" disabled={disabled || content.length === 0}>
        <HugeiconsIcon icon={SentIcon} strokeWidth={2} />
      </Button>
    </form>
  )
}