export type LockUntil =
  | { kind: 'untilUnlocked' }
  | { kind: 'until'; date: Date | undefined; time: string }

export const defaultLockUntil: LockUntil = { kind: 'untilUnlocked' }

export function lockEnd(lockUntil: LockUntil): Date | undefined {
  if (lockUntil.kind === 'untilUnlocked' || !lockUntil.date) return undefined

  const [hours, minutes] = lockUntil.time.split(':').map(Number)
  const end = new Date(lockUntil.date)
  end.setHours(hours, minutes, 0, 0)
  return end
}

export function validateLockUntil(lockUntil: LockUntil): string | null {
  if (lockUntil.kind === 'untilUnlocked') return null
  if (!lockUntil.date) return 'Pick the day the lock ends.'

  const end = lockEnd(lockUntil)
  return end && end > new Date() ? null : 'The lock has to end in the future.'
}