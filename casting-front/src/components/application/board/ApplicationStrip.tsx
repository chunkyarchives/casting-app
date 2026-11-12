import type { ReactNode } from 'react'
import { GripIcon, HandshakeIcon, MaskTheater01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { MediaImage } from '@/components/common/media/MediaImage'
import { ProfileAvatar } from '@/components/common/media/ProfileAvatar'
import { mediaUrl } from '@/lib/api/media'
import { cn } from '@/lib/utils'
import type { RoleApplication } from '@/types/application'

type Props = {
  application: RoleApplication
  index: number
  note: string
  children: ReactNode
}

const circleClass = 'size-12 justify-self-center sm:size-18'
const dashClass = 'h-0 border-t-2 border-dashed border-muted-foreground/35'
const labelClass = 'line-clamp-2 text-center text-sm font-semibold wrap-break-word'
const noteClass = 'line-clamp-2 text-center text-xs text-muted-foreground'

function RolePlaceholder() {
  return (
    <span className="flex size-full items-center justify-center text-muted-foreground">
      <HugeiconsIcon icon={MaskTheater01Icon} strokeWidth={1.5} className="size-1/2" />
    </span>
  )
}

export function ApplicationStrip({ application, index, note, children }: Props) {
  const { ref, handleRef, isDragging } = useSortable({ id: application.id, index })

  return (
    <li
      ref={ref}
      aria-label={`${application.actorName} for ${application.filmRoleName}`}
      className={cn(
        'rounded-2xl border bg-card px-3 py-3 shadow-sm transition-shadow sm:px-6 sm:py-4',
        isDragging && 'relative z-10 shadow-2xl ring-1 ring-primary/40',
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0.5rem,0.4fr)_auto_minmax(0.5rem,0.4fr)_minmax(0,1fr)] items-center gap-x-1.5 gap-y-2 sm:grid-cols-[minmax(0,10rem)_minmax(2rem,1fr)_auto_minmax(2rem,1fr)_minmax(0,10rem)] sm:gap-x-4">
        <span className={cn('col-start-1 row-start-1', labelClass)}>{application.actorName}</span>
        <button
          ref={handleRef}
          type="button"
          aria-label={`Move ${application.actorName} for ${application.filmRoleName}`}
          title="Drag to reorder"
          className="col-start-3 row-start-1 flex size-7 cursor-grab touch-none items-center justify-center justify-self-center rounded-xl text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 active:cursor-grabbing"
        >
          <HugeiconsIcon icon={GripIcon} strokeWidth={2} className="size-5" />
        </button>
        <span className={cn('col-start-5 row-start-1', labelClass)}>{application.filmRoleName}</span>

        <ProfileAvatar participantId={application.actorId} fade={false} className={cn('col-start-1 row-start-2', circleClass)} />
        <span aria-hidden className={cn('col-start-2 row-start-2', dashClass)} />
        <span
          aria-hidden
          className="col-start-3 row-start-2 flex size-12 items-center justify-center justify-self-center rounded-full border bg-muted sm:size-14"
        >
          <HugeiconsIcon icon={HandshakeIcon} strokeWidth={1.5} className="size-6 sm:size-7" />
        </span>
        <span aria-hidden className={cn('col-start-4 row-start-2', dashClass)} />
        <span className={cn('col-start-5 row-start-2 overflow-hidden rounded-full border bg-muted', circleClass)}>
          {application.roleImageUrl ? (
            <MediaImage src={mediaUrl(application.roleImageUrl)} alt="" className="size-full" fallback={<RolePlaceholder />} />
          ) : (
            <RolePlaceholder />
          )}
        </span>

        <span className={cn('col-start-1 row-start-3', noteClass)}>{note}</span>
        <div className="col-span-5 row-start-4 flex justify-center gap-2 pt-1 sm:col-span-1 sm:col-start-3 sm:row-start-3 sm:pt-0">
          {children}
        </div>
        <span className={cn('col-start-5 row-start-3', noteClass)}>{application.filmTitle}</span>
      </div>
    </li>
  )
}