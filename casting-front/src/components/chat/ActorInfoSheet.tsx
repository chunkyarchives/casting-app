import { Link04Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { CountryFlag } from '@/components/common/display/CountryFlag'
import { CloseProfileAvatar } from '@/components/common/media/CloseProfileAvatar'
import { LoadError } from '@/components/common/states/LoadError'
import { PageLoader } from '@/components/common/states/PageLoader'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useApiQuery } from '@/hooks/useApiQuery'
import { actorsApi } from '@/lib/api/actors'
import { applicationsApi } from '@/lib/api/applications'
import { countryName } from '@/lib/countries'
import { formatDate } from '@/lib/format'
import type { Actor } from '@/types/actor'
import type { ApplicationStatus, RoleApplication } from '@/types/application'

const statusLabels: Record<ApplicationStatus, string> = {
  Proposed: 'Pending',
  Accepted: 'Accepted',
  Rejected: 'Rejected',
}

const statusVariants: Record<ApplicationStatus, 'outline' | 'default' | 'destructive'> = {
  Proposed: 'outline',
  Accepted: 'default',
  Rejected: 'destructive',
}

type Props = {
  actorId: string
  name: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActorInfoSheet({ actorId, name, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{name}</SheetTitle>
          <SheetDescription>Profile and applications to your films</SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4">
          {open && <ActorInfo actorId={actorId} name={name} />}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function ActorInfo({ actorId, name }: { actorId: string; name: string }) {
  const actor = useApiQuery(`chat-actor-${actorId}`, () => actorsApi.get(actorId))
  const applications = useApiQuery(`chat-actor-applications-${actorId}`, () => applicationsApi.list({ actorId }))

  return (
    <>
      {actor.status === 'loading' && <PageLoader />}
      {actor.status === 'error' && <LoadError title="The profile could not be loaded" error={actor.error} onRetry={actor.reload} />}
      {actor.status === 'success' && <ActorProfile actor={actor.data} name={name} />}

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold">Applications</h3>
        {applications.status === 'loading' && <PageLoader className="p-4" />}
        {applications.status === 'error' && (
          <LoadError title="Applications could not be loaded" error={applications.error} onRetry={applications.reload} />
        )}
        {applications.status === 'success' && applications.data.length === 0 && (
          <p className="text-sm text-muted-foreground">No applications to your films.</p>
        )}
        {applications.status === 'success' && applications.data.length > 0 && (
          <ul className="flex flex-col gap-2">
            {applications.data.map((application) => (
              <li key={application.id}>
                <ApplicationRow application={application} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

function ActorProfile({ actor, name }: { actor: Actor; name: string }) {
  const facts = [
    actor.age !== null ? `${actor.age} years` : null,
    actor.gender,
    actor.height !== null ? `${actor.height} cm` : null,
    actor.weight !== null ? `${actor.weight} kg` : null,
  ].filter((fact) => fact !== null)

  return (
    <section className="flex flex-col items-center gap-3 text-center">
      <CloseProfileAvatar participantId={actor.id} name={name} className="size-24" />
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm text-muted-foreground">{facts.join(' · ')}</p>
        {actor.origin && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CountryFlag code={actor.origin} decorative className="h-3" />
            {countryName(actor.origin)}
          </p>
        )}
      </div>

      {actor.roleInterests.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {actor.roleInterests.map((interest) => (
            <Badge key={interest} variant="secondary">
              {interest}
            </Badge>
          ))}
        </div>
      )}

      {actor.bio && <p className="text-left text-sm whitespace-pre-line">{actor.bio}</p>}

      {actor.links.length > 0 && (
        <ul className="flex w-full flex-col gap-1 text-left">
          {actor.links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-accent"
              >
                <HugeiconsIcon icon={Link04Icon} strokeWidth={2} className="size-4 text-muted-foreground" />
                <span className="truncate">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function ApplicationRow({ application }: { application: RoleApplication }) {
  const source = application.proposedByName ? `Proposed by ${application.proposedByName}` : 'Applied'

  return (
    <div className="flex items-start gap-3 rounded-2xl border p-3">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-medium">{application.filmRoleName}</span>
        <span className="truncate text-xs text-muted-foreground">{application.filmTitle}</span>
        <span className="text-xs text-muted-foreground">
          {source} · {formatDate(application.createdAt)}
        </span>
      </div>
      <Badge variant={statusVariants[application.status]}>{statusLabels[application.status]}</Badge>
    </div>
  )
}