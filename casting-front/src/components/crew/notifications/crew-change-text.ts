import type { CrewMemberChange } from '@/types/crew'

export function crewChangeTitle(change: CrewMemberChange, viewerId: string) {
  const name = `${change.firstName} ${change.lastName}`

  if (change.change === 'Joined') return `${name} joined ${change.productionName}`
  if (change.change === 'Left') return `${name} left ${change.productionName}`
  if (change.castingDirectorId === viewerId) return `You were removed from ${change.productionName}`
  return `${name} was removed from ${change.productionName}`
}