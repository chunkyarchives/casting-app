import { useState } from 'react'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { ConfirmDeleteDialog } from '@/components/film/director/ConfirmDeleteDialog'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { Button } from '@/components/ui/button'

type Props = {
  label: string
  hint: string
  title: string
  description: string
  onDelete: () => Promise<void>
}

export function DeleteRow({ label, hint, title, description, onDelete }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <SettingsRow label={label} hint={hint}>
      <Button type="button" variant="destructive" onClick={() => setOpen(true)}>
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} data-icon="inline-start" />
        {label}
      </Button>

      <ConfirmDeleteDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        confirmLabel={label}
        onConfirm={onDelete}
      />
    </SettingsRow>
  )
}