import { SecurityLockIcon } from '@hugeicons/core-free-icons'
import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'
import { PrivacyForm } from '@/components/privacy/PrivacyForm'
import { SettingsScreen } from '@/components/settings/SettingsScreen'

export default function PrivacySettings() {
  const participant = useCurrentParticipant()

  return (
    <SettingsScreen title="Privacy" icon={SecurityLockIcon}>
      {participant && <PrivacyForm participant={participant} />}
    </SettingsScreen>
  )
}