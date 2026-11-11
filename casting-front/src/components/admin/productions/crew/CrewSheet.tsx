import type { ReactNode } from 'react'
import { Delete02Icon, Refresh01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { memberName, type ProductionAction } from '@/components/admin/productions/production-actions'
import {
  siteMemberCount,
  type CrewRow,
  type NoProductionRow,
  type ProductionRow,
} from '@/components/admin/productions/production-rows'
import { CloseProfileAvatar } from '@/components/common/media/CloseProfileAvatar'
import { DetailGroup, DetailGroupsSkeleton, DetailRow } from '@/components/common/display/DetailList'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { LoadError } from '@/components/common/states/LoadError'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery'
import { adminApi } from '@/lib/api/admin'
import { formatCount, formatDateTime } from '@/lib/format'
import type { AdminCrew, AdminCrewMember } from '@/types/admin'

const maxMemberSkeletons = 5

type Props = {
  row: ProductionRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
  revision: number
  onAction: (action: ProductionAction) => void
}

export function CrewSheet({ row, open, onOpenChange, revision, onAction }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        {row && (
          <>
            <SheetHeader className="pr-12">
              <SheetTitle>{row.crew?.productionName ?? 'Unnamed production'}</SheetTitle>
              <SheetDescription>Directed by {row.directorName}</SheetDescription>
            </SheetHeader>

            {row.crew === null ? (
              <NoProductionDetails key={row.directorId} row={row} onAction={onAction} />
            ) : (
              <CrewDetails key={row.directorId} row={row} revision={revision} onAction={onAction} />
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

type CrewDetailsProps = Pick<Props, 'revision' | 'onAction'> & {
  row: CrewRow
}

function CrewDetails({ row, revision, onAction }: CrewDetailsProps) {
  const { crew } = row
  const details = useApiQuery(`admin-crew-${crew.id}`, () => adminApi.getCrew(crew.id), { refresh: revision })

  if (details.status === 'loading') return <CrewDetailsSkeleton memberCount={siteMemberCount(row)} />
  if (details.status === 'error') {
  return (
      <LoadError title="Production could not be loaded" error={details.error} onRetry={details.reload} className="p-6" />
  )
  }

  const { data } = details

  return (
    <>
      <div className="flex flex-col gap-6 px-6 pb-6">
        <DetailGroup title="Production">
          <DetailRow label="Code">
            <span className="font-mono tracking-wider">{data.productionCode}</span>
          </DetailRow>
          <DetailRow label="Created">{formatDateTime(data.createdAt)}</DetailRow>
          <DetailRow label="Films">{formatCount(data.films.length)}</DetailRow>
        </DetailGroup>

        <Separator />

        <SiteMemberList
          director={{ id: data.directorId, name: data.directorName, email: data.directorEmail }}
          members={data.members}
          onRemove={(member) => onAction({ kind: 'removeMember', crew: data, member })}
        />
      </div>

      <ProductionButtons crew={crew} onAction={onAction} />
    </>
  )
}

type NoProductionDetailsProps = Pick<Props, 'onAction'> & {
  row: NoProductionRow
}

function NoProductionDetails({ row, onAction }: NoProductionDetailsProps) {
  return (
    <>
      <div className="flex flex-col gap-6 px-6 pb-6">
        <DetailGroup title="Production">
          <DetailRow label="Code">N/A</DetailRow>
          <DetailRow label="Created">N/A</DetailRow>
          <DetailRow label="Films">{formatCount(row.filmCount)}</DetailRow>
        </DetailGroup>

        <Separator />

        <SiteMemberList
          director={{ id: row.directorId, name: row.directorName, email: row.directorEmail }}
          members={null}
        />

        <p className="text-sm text-muted-foreground">
          {row.directorName} hasn't started a production yet, so there is no code to regenerate and nothing to
          delete.
        </p>
      </div>

      <ProductionButtons crew={null} onAction={onAction} />
    </>
  )
}

type ProductionButtonsProps = Pick<Props, 'onAction'> & {
  crew: AdminCrew | null
}

function ProductionButtons({ crew, onAction }: ProductionButtonsProps) {
  return (
    <SheetFooter>
      <Button
        variant="outline"
        disabled={crew === null}
        onClick={() => crew && onAction({ kind: 'regenerateCode', crew })}
      >
        <HugeiconsIcon icon={Refresh01Icon} strokeWidth={2} />
        Regenerate code
      </Button>
      <Button
        variant="destructive"
        disabled={crew === null}
        onClick={() => crew && onAction({ kind: 'deleteCrew', crew })}
      >
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
        Delete production
      </Button>
    </SheetFooter>
  )
}

type SiteMember = { id: string; name: string; email: string }

type SiteMemberListProps = {
  director: SiteMember
  members: AdminCrewMember[] | null
  onRemove?: (member: AdminCrewMember) => void
}

function SiteMemberList({ director, members, onRemove }: SiteMemberListProps) {

  return (
    <section className="flex flex-col gap-3 text-sm">
      <h3 className="font-medium">Site members</h3>

      <ul className="flex flex-col divide-y">
        <MemberRow participantId={director.id} name={director.name} email={director.email}>
          <span className="px-2.5 text-xs text-muted-foreground">Director</span>
        </MemberRow>

        {members?.map((member) => (
          <MemberRow
            key={member.castingDirectorId}
            participantId={member.castingDirectorId}
            name={memberName(member)}
            email={member.email}
          >
            <Button variant="ghost" size="xs" className="text-destructive" onClick={() => onRemove?.(member)}>
              Remove
            </Button>
          </MemberRow>
        ))}
      </ul>

      {members?.length === 0 && <p className="text-muted-foreground">No casting directors have joined yet.</p>}
    </section>
  )
}

type MemberRowProps = {
  participantId: string
  name: string
  email: string
  children: ReactNode
}

function MemberRow({ participantId, name, email, children }: MemberRowProps) {
  return (
    <li className="flex items-center gap-3 py-2">
      <CloseProfileAvatar participantId={participantId} name={name} className="size-8" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium">{name}</span>
        <span className="truncate text-xs text-muted-foreground">{email}</span>
      </div>
      {children}
    </li>
  )
}

function CrewDetailsSkeleton({ memberCount }: { memberCount: number }) {
  return (
    <div className="flex flex-col gap-6 px-6 pb-6" aria-busy>
      <DetailGroupsSkeleton rowCounts={[3]} />
      <Separator />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-28" />
        <div className="flex flex-col">
          {Array.from({ length: Math.min(memberCount, maxMemberSkeletons) }, (_, index) => (
            <div key={index} className="flex items-center gap-3 py-2">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}