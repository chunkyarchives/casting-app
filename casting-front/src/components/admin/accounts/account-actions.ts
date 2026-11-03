import type { ReasonAction } from '@/components/admin/ReasonDialog'
import { adminApi } from '@/lib/api/admin'
import { formatCount } from '@/lib/format'
import type { AdminAccount } from '@/types/admin'

export type AccountAction = 'details' | 'lock' | 'unlock' | 'forceLogout' | 'delete'

export type ConfirmedAction = Exclude<AccountAction, 'details'>

export const fullName = (account: Pick<AdminAccount, 'firstName' | 'lastName'>) =>
  `${account.firstName} ${account.lastName}`

export function describeAccountAction(
  action: ConfirmedAction,
  account: AdminAccount,
  lockUntil?: Date,
): ReasonAction {
  const name = fullName(account)

  switch (action) {
    case 'lock':
      return {
        title: `Lock ${name}?`,
        description: 'They are signed out everywhere and cannot sign in until the lock ends.',
        confirmLabel: 'Lock account',
        pendingLabel: 'Locking…',
        reasonRequired: true,
        destructive: true,
        run: async (reason) => {
          await adminApi.lockAccount(account.id, { reason, until: lockUntil?.toISOString() })
          return 'Account locked'
        },
      }

    case 'unlock':
      return {
        title: `Unlock ${name}?`,
        description: 'They can sign in again right away.',
        confirmLabel: 'Unlock account',
        pendingLabel: 'Unlocking…',
        reasonRequired: false,
        destructive: false,
        run: async (reason) => {
          await adminApi.unlockAccount(account.id, reason || undefined)
          return 'Account unlocked'
        },
      }

    case 'forceLogout':
      return {
        title: `Sign ${name} out everywhere?`,
        description: 'All their sessions end. They can sign in again right away.',
        confirmLabel: 'Sign out',
        pendingLabel: 'Signing out…',
        reasonRequired: false,
        destructive: false,
        run: async (reason) => {
          const { sessionsEnded } = await adminApi.forceLogout(account.id, reason || undefined)
          return `${formatCount(sessionsEnded)} ${sessionsEnded === 1 ? 'session' : 'sessions'} ended`
        },
      }

    case 'delete':
      return {
        title: `Delete ${name}?`,
        description:
          'The account is deleted permanently, together with its profile, applications and uploaded files. This cannot be undone.',
        confirmLabel: 'Delete account',
        pendingLabel: 'Deleting…',
        reasonRequired: true,
        destructive: true,
        run: async (reason) => {
          await adminApi.deleteAccount(account.id, reason)
          return 'Account deleted'
        },
      }
  }
}