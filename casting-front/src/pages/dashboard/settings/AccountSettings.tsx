import { UserCircleIcon } from '@hugeicons/core-free-icons'
import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'
import { ActorAccount } from '@/components/profile/actor/ActorAccount'
import { CastingDirectorAccount } from '@/components/profile/casting-director/CastingDirectorAccount'
import { DirectorAccount } from '@/components/profile/director/DirectorAccount'
import { SettingsScreen } from '@/components/settings/SettingsScreen'
import type { SignUpRole } from '@/types/participant'

const accounts = {
  Actor: ActorAccount,
  Director: DirectorAccount,
  CastingDirector: CastingDirectorAccount,
}

export default function AccountSettings({ role }: { role: SignUpRole }) {
  const participant = useCurrentParticipant()
  const Account = accounts[role]

  return (
    <SettingsScreen title="Your account" icon={UserCircleIcon}>
      {participant && <Account participant={participant} />}
    </SettingsScreen>
  )
}