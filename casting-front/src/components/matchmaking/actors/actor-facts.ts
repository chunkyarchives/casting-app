import type { ActorSummary } from '@/types/actor'

export const actorName = (actor: ActorSummary) => `${actor.firstName} ${actor.lastName}`

export function actorFacts(actor: ActorSummary) {
  const body = [
    actor.height !== null ? `${actor.height} cm` : null,
    actor.weight !== null ? `${actor.weight} kg` : null,
  ].filter((fact) => fact !== null)

  const person = [actor.age !== null ? `${actor.age} years` : null, actor.gender].filter((fact) => fact !== null)

  return [person, body].filter((line) => line.length > 0).map((line) => line.join(' · '))
}