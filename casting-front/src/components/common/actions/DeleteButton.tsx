import { useState } from 'react'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '@/lib/utils'
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog'
import { overlayActionClass } from './overlay-action'

type Props = {
  label: string
  title: string
  description: string
  confirmLabel: string
  onDelete: () => Promise<void>
}

export function DeleteButton({ label, title, description, confirmLabel, onDelete }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label={label}
        title={confirmLabel}
        onClick={() => setOpen(true)}
        className={cn(overlayActionClass, 'text-destructive hover:bg-destructive hover:text-white')}
      >
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
      </button>

      <ConfirmDeleteDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        confirmLabel={confirmLabel}
        onConfirm={onDelete}
      />
    </>
  )
}