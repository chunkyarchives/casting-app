import type { Option } from '@/components/common/list/FilterMenu'
import type { AdminAction } from '@/types/admin'

export type ActionTone = 'danger' | 'warning' | 'success' | 'info'

type ActionInfo = {
  code: string
  label: string
  tone: ActionTone
}

export const auditActions: Record<AdminAction, ActionInfo> = {
  LockAccount: { code: 'account.lock', label: 'Lock', tone: 'warning' },
  UnlockAccount: { code: 'account.unlock', label: 'Unlock', tone: 'success' },
  ForceLogout: { code: 'account.force_logout', label: 'Force logout', tone: 'info' },
  DeleteAccount: { code: 'account.delete', label: 'Delete', tone: 'danger' },
  RegenerateCrewCode: { code: 'production.new_code', label: 'New code', tone: 'info' },
  RemoveCrewMember: { code: 'production.remove_member', label: 'Remove member', tone: 'warning' },
  DeleteCrew: { code: 'production.delete', label: 'Delete', tone: 'danger' },
  DeleteFilm: { code: 'film.delete', label: 'Delete film', tone: 'danger' },
  DeleteConversation: { code: 'conversation.delete', label: 'Delete conversation', tone: 'danger' },
}

const groupedActions: { label: string; actions: AdminAction[] }[] = [
  { label: 'Accounts', actions: ['LockAccount', 'UnlockAccount', 'ForceLogout', 'DeleteAccount'] },
  { label: 'Productions', actions: ['RegenerateCrewCode', 'RemoveCrewMember', 'DeleteCrew'] },
  { label: 'Content', actions: ['DeleteFilm', 'DeleteConversation'] },
]

export const actionGroups: { label: string; options: Option<AdminAction>[] }[] = groupedActions.map(({ label, actions }) => ({
  label,
  options: actions.map((value) => ({ value, label: auditActions[value].label })),
}))

export const toneColors: Record<ActionTone, string> = {
  danger: 'text-red-600',
  warning: 'text-amber-600',
  success: 'text-emerald-600',
  info: 'text-sky-600',
}

const targetTypeLabels: Record<string, string> = { Crew: 'Production' }

export const targetTypeLabel = (targetType: string) => targetTypeLabels[targetType] ?? targetType