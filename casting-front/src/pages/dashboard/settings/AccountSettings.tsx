import { UserCircleIcon } from '@hugeicons/core-free-icons'
import { ActorAccount } from '@/components/profile/actor/ActorAccount'
import { SettingsScreen } from '@/components/settings/SettingsScreen'
import type { SignUpRole } from '@/types/participant'

export default function AccountSettings({ role }: { role: SignUpRole }) {
  return (
    <SettingsScreen title="Your account" icon={UserCircleIcon}>
      {role === 'Actor' && <ActorAccount />}
    </SettingsScreen>
  )
}