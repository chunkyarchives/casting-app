import { adminApi } from '@/lib/api/admin'
import { formatCount } from '@/lib/format'
import type { AdminAccount } from '@/types/admin'

export type AccountAction = 'details' | 'lock' | 'unlock' | 'forceLogout' | 'delete'

export type ConfirmedAction = Exclude<AccountAction, 'details'>

export type ActionInput = {
  reason: string
  lockUntil?: Date
}

type ActionDefinition = {
  title: (name: string) => string
  description: string
  confirmLabel: string
  pendingLabel: string
  reasonRequired: boolean
  destructive: boolean
  run: (account: AdminAccount, input: ActionInput) => Promise<string>
}

export const accountActions: Record<ConfirmedAction, ActionDefinition> = {
  lock: {
    title: (name) => `Lock ${name}?`,
    description: 'They are signed out everywhere and cannot sign in until the lock ends.',
    confirmLabel: 'Lock account',
    pendingLabel: 'Locking…',
    reasonRequired: true,
    destructive: true,
    run: async (account, { reason, lockUntil }) => {
      await adminApi.lockAccount(account.id, { reason, until: lockUntil?.toISOString() })
      return 'Account locked'
    },
  },
  unlock: {
    title: (name) => `Unlock ${name}?`,
    description: 'They can sign in again right away.',
    confirmLabel: 'Unlock account',
    pendingLabel: 'Unlocking…',
    reasonRequired: false,
    destructive: false,
    run: async (account, { reason }) => {
      await adminApi.unlockAccount(account.id, reason || undefined)
      return 'Account unlocked'
    },
  },
  forceLogout: {
    title: (name) => `Sign ${name} out everywhere?`,
    description: 'All their sessions end. They can sign in again right away.',
    confirmLabel: 'Sign out',
    pendingLabel: 'Signing out…',
    reasonRequired: false,
    destructive: false,
    run: async (account, { reason }) => {
      const { sessionsEnded } = await adminApi.forceLogout(account.id, reason || undefined)
      return `${formatCount(sessionsEnded)} ${sessionsEnded === 1 ? 'session' : 'sessions'} ended`
    },
  },
  delete: {
    title: (name) => `Delete ${name}?`,
    description:
      'The account is deleted permanently, together with its profile, applications and uploaded files. This cannot be undone.',
    confirmLabel: 'Delete account',
    pendingLabel: 'Deleting…',
    reasonRequired: true,
    destructive: true,
    run: async (account, { reason }) => {
      await adminApi.deleteAccount(account.id, reason)
      return 'Account deleted'
    },
  },
}

export const fullName = (account: Pick<AdminAccount, 'firstName' | 'lastName'>) => `${account.firstName} ${account.lastName}`