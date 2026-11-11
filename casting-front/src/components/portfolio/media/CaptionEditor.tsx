import { useState } from 'react'
import { Cancel01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { apiErrorMessage } from '@/lib/api/errors'

export const captionMaxLength = 140

type Props = {
  caption: string | null
  onSave: (caption: string | null) => Promise<void>
  onClose: () => void
}

export function CaptionEditor({ caption, onSave, onClose }: Props) {
  const [value, setValue] = useState(caption ?? '')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    const saved = await onSave(value.trim() || null).then(
      () => true,
      (error: unknown) => {
        toast.add({ type: 'error', title: 'The caption could not be saved', description: apiErrorMessage(error) })
        return false
      },
    )
    setSaving(false)
    if (saved) onClose()
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void save()
      }}
      className="absolute inset-x-2 bottom-2 z-10 flex gap-1.5"
    >
      <Input
        ref={(input) => input?.focus()}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onClose()
        }}
        maxLength={captionMaxLength}
        placeholder="Caption"
        aria-label="Caption"
        disabled={saving}
        className="h-8 min-w-0 flex-1 bg-background/95 text-xs"
      />
      <Button type="submit" size="icon-sm" aria-label="Save caption" disabled={saving}>
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
      </Button>
      <Button type="button" variant="secondary" size="icon-sm" aria-label="Cancel" disabled={saving} onClick={onClose}>
        <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
      </Button>
    </form>
  )
}