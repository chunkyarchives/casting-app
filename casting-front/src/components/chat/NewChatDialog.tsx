import { useState } from 'react'
import { UserSearch01Icon } from '@hugeicons/core-free-icons'
import { SearchField } from '@/components/common/list/SearchField'
import { ProfileAvatar } from '@/components/common/media/ProfileAvatar'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { LoadError } from '@/components/common/states/LoadError'
import { PageLoader } from '@/components/common/states/PageLoader'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/components/ui/toast'
import { useApiQuery } from '@/hooks/useApiQuery'
import { applicationsApi } from '@/lib/api/applications'
import { conversationsApi } from '@/lib/api/conversations'
import { apiErrorMessage } from '@/lib/api/errors'
import { ApiError } from '@/lib/api/http'
import type { RoleApplication } from '@/types/application'
import type { Conversation } from '@/types/conversation'

type Applicant = {
  actorId: string
  actorName: string
  roles: string[]
}

function toApplicants(applications: RoleApplication[]) {
  const applicants = new Map<string, Applicant>()

  for (const application of applications) {
    const role = `${application.filmRoleName} · ${application.filmTitle}`
    const known = applicants.get(application.actorId)

    if (!known) applicants.set(application.actorId, { actorId: application.actorId, actorName: application.actorName, roles: [role] })
    else if (!known.roles.includes(role)) known.roles.push(role)
  }

  return [...applicants.values()]
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStarted: (conversation: Conversation) => void
}

export function NewChatDialog({ open, onOpenChange, onStarted }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
          <DialogDescription>You can write to actors who applied for a role in your films.</DialogDescription>
        </DialogHeader>
        <ApplicantPicker onStarted={onStarted} />
      </DialogContent>
    </Dialog>
  )
}

function ApplicantPicker({ onStarted }: { onStarted: (conversation: Conversation) => void }) {
  const [search, setSearch] = useState('')
  const [starting, setStarting] = useState<string | null>(null)
  const applications = useApiQuery('chat-applicants', () => applicationsApi.list())

  const start = async (applicant: Applicant) => {
    setStarting(applicant.actorId)
    try {
      onStarted(await conversationsApi.start(applicant.actorId))
    } catch (error) {
      const description = error instanceof ApiError && error.detail ? error.detail : apiErrorMessage(error)
      toast.add({ type: 'error', title: 'The chat could not be started', description })
    }
    setStarting(null)
  }

  const term = search.toLowerCase()
  const applicants = applications.status === 'success' ? toApplicants(applications.data) : []
  const visible = applicants.filter((applicant) => applicant.actorName.toLowerCase().includes(term))

  return (
    <div className="flex flex-col gap-3">
      <SearchField value={search} onChange={setSearch} placeholder="Search applicants" label="Search applicants" />

      <div className="-mx-2 h-80 overflow-y-auto">
        {applications.status === 'loading' && <PageLoader />}
        {applications.status === 'error' && (
          <LoadError title="Applicants could not be loaded" error={applications.error} onRetry={applications.reload} />
        )}
        {applications.status === 'success' && visible.length === 0 && (
          <EmptyMessage
            icon={UserSearch01Icon}
            title={applicants.length === 0 ? 'No applicants yet' : 'No applicants found'}
            description={
              applicants.length === 0
                ? 'Actors who apply for roles in your films show up here.'
                : 'Try another name.'
            }
          />
        )}
        {visible.length > 0 && (
          <ul className="flex flex-col">
            {visible.map((applicant) => (
              <li key={applicant.actorId}>
                <button
                  type="button"
                  disabled={starting !== null}
                  onClick={() => void start(applicant)}
                  className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition-colors hover:bg-accent disabled:opacity-60"
                >
                  <ProfileAvatar participantId={applicant.actorId} className="size-10 shrink-0" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium">{applicant.actorName}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {applicant.roles[0]}
                      {applicant.roles.length > 1 && ` +${applicant.roles.length - 1} more`}
                    </span>
                  </div>
                  {starting === applicant.actorId && <Spinner className="size-4 text-muted-foreground" />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}