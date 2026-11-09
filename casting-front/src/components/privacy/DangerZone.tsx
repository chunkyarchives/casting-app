import { useState } from 'react'
import { Delete02Icon, PauseIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { SettingsGroup } from '@/components/settings/SettingsGroup'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { Button } from '@/components/ui/button'
import type { ParticipantRole } from '@/types/participant'
import { DeactivateDialog } from './DeactivateDialog'
import { DeleteAccountDialog } from './DeleteAccountDialog'

type DangerAction = 'deactivate' | 'delete'

export function DangerZone({ role }: { role: ParticipantRole }) {
  const [action, setAction] = useState<DangerAction | null>(null)

  const dialogProps = (dialog: DangerAction) => ({
    open: action === dialog,
    onOpenChange: (open: boolean) => setAction(open ? dialog : null),
  })

  return (
    <SettingsGroup title="Danger zone">
      <SettingsRow
        label="Deactivate account"
        hint="Hides your profile and signs you out everywhere until the day you pick. Signing in earlier brings it back."
      >
        <Button type="button" variant="outline" onClick={() => setAction('deactivate')}>
          <HugeiconsIcon icon={PauseIcon} strokeWidth={2} data-icon="inline-start" />
          Deactivate
        </Button>
      </SettingsRow>

      <SettingsRow label="Delete account" hint="Removes your account and everything in it for good. It can't be undone.">
        <Button type="button" variant="destructive" onClick={() => setAction('delete')}>
          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} data-icon="inline-start" />
          Delete account
        </Button>
      </SettingsRow>

      <DeactivateDialog {...dialogProps('deactivate')} />
      <DeleteAccountDialog role={role} {...dialogProps('delete')} />
    </SettingsGroup>
  )
}