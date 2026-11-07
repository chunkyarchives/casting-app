import { CountryFlag } from '@/components/common/display/CountryFlag'
import { CloseProfileAvatar } from '@/components/common/media/CloseProfileAvatar'
import { hasOrigin } from '@/lib/roles'
import type { CurrentParticipant } from '@/types/participant'

const textLine = 'overflow-x-clip text-ellipsis whitespace-nowrap [text-box:trim-both_cap_alphabetic]'

export function SidebarProfile({ participant }: { participant: CurrentParticipant }) {
  return (
    <div className="flex items-center gap-3">
      <CloseProfileAvatar
        participantId={participant.id}
        name={`${participant.firstName} ${participant.lastName}`}
        className="size-10 shrink-0 transition-[width,height] duration-200 group-data-[collapsible=icon]:size-8"
      />
      <div className="flex h-7 min-w-0 flex-1 gap-3 group-data-[collapsible=icon]:hidden">
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <p className={`${textLine} text-sm font-medium`}>
            {participant.firstName} {participant.lastName}
          </p>
          <p className={`${textLine} text-xs text-muted-foreground`}>{participant.email}</p>
        </div>
        {hasOrigin(participant.role) && (
          <CountryFlag
            code={participant.origin}
            className="h-full shrink-0 outline -outline-offset-1 outline-sidebar-foreground/40"
          />
        )}
      </div>
    </div>
  )
}