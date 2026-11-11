import { PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { DeleteButton } from '@/components/common/actions/DeleteButton'
import { overlayActionClass } from '@/components/common/actions/overlay-action'

type Props = {
  itemLabel: string
  onEdit: () => void
  onDelete: () => Promise<void>
}

export function MediaActions({ itemLabel, onEdit, onDelete }: Props) {
  return (
    <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 transition-opacity duration-200 group-focus-within/media:opacity-100 group-hover/media:opacity-100 pointer-coarse:opacity-100">
      <button
        type="button"
        aria-label={`Edit the caption of ${itemLabel}`}
        title="Edit caption"
        onClick={onEdit}
        className={overlayActionClass}
      >
        <HugeiconsIcon icon={PencilEdit02Icon} strokeWidth={2} />
      </button>
      <DeleteButton
        label={`Delete ${itemLabel}`}
        confirmLabel="Delete"
        title={`Delete ${itemLabel}?`}
        description="It's removed from your portfolio for good. This can't be undone."
        onDelete={onDelete}
      />
    </div>
  )
}