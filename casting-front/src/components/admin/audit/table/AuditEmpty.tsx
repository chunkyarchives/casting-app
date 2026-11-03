import { CommandLineIcon, UnavailableIcon } from '@hugeicons/core-free-icons'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { NoResults } from '@/components/common/states/NoResults'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/format'

type Props = {
  filtered: boolean
  clearedAt: string | null
  onRestoreLog: () => void
}

export function AuditEmpty({ filtered, clearedAt, onRestoreLog }: Props) {
  if (filtered) return <NoResults />

  if (clearedAt) {
    return (
      <EmptyMessage
        icon={UnavailableIcon}
        title="Log cleared"
        description={`Entries up to ${formatDateTime(clearedAt)} are hidden on this device only. New ones will show up here.`}
      >
        <Button variant="outline" size="sm" onClick={onRestoreLog}>
          Show all entries
        </Button>
      </EmptyMessage>
    )
  }

  return (
    <EmptyMessage
      icon={CommandLineIcon}
      title="No admin actions yet"
      description="Locks, deletions and other admin actions will be logged here."
    />
  )
}