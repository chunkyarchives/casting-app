import type { Actor } from '@/types/actor'
import type { ProfileCheck } from './ProfileCard'

export const actorChecklist = (actor: Actor, hasPicture: boolean): ProfileCheck[] => [
  { label: 'Profile picture', done: hasPicture },
  { label: 'Date of birth', done: actor.dateOfBirth !== null },
  { label: 'Gender', done: Boolean(actor.gender) },
  { label: 'Origin', done: Boolean(actor.origin) },
  { label: 'Height', done: (actor.height ?? 0) > 0 },
  { label: 'Weight', done: (actor.weight ?? 0) > 0 },
]

export const actorFacts = (actor: Actor) =>
  [
    actor.age !== null && `${actor.age} years`,
    actor.gender,
    actor.height && `${actor.height} cm`,
    actor.weight && `${actor.weight} kg`,
  ].filter((fact): fact is string => Boolean(fact))