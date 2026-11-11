import { useState } from 'react'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog'

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
      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        aria-label={label}
        title={confirmLabel}
        onClick={() => setOpen(true)}
        className="text-destructive shadow-md hover:bg-destructive hover:text-white"
      >
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
      </Button>

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