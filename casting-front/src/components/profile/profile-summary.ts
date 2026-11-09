import type { Actor } from '@/types/actor'
import type { CastingDirector } from '@/types/casting-director'
import type { Director } from '@/types/director'
import type { ProfileCheck } from './ProfileCard'

type Person = {
  dateOfBirth: string | null
  age: number | null
  gender: string | null
}

const personChecks = (person: Person): ProfileCheck[] => [
  { label: 'Date of birth', done: person.dateOfBirth !== null },
  { label: 'Gender', done: Boolean(person.gender) },
]

const personFacts = (person: Person) => [person.age !== null && `${person.age} years`, person.gender]

const onlyFilled = (facts: (string | false | null | undefined | 0)[]) =>
  facts.filter((fact): fact is string => Boolean(fact))

export const actorChecklist = (actor: Actor, hasPicture: boolean): ProfileCheck[] => [
  { label: 'Profile picture', done: hasPicture },
  ...personChecks(actor),
  { label: 'Origin', done: Boolean(actor.origin) },
  { label: 'Height', done: (actor.height ?? 0) > 0 },
  { label: 'Weight', done: (actor.weight ?? 0) > 0 },
]

export const actorFacts = (actor: Actor) =>
  onlyFilled([...personFacts(actor), actor.height && `${actor.height} cm`, actor.weight && `${actor.weight} kg`])

export const directorChecklist = (director: Director): ProfileCheck[] => [
  ...personChecks(director),
  { label: 'Origin', done: Boolean(director.origin) },
]

export const directorFacts = (director: Director) => onlyFilled(personFacts(director))

export const castingDirectorChecklist = (castingDirector: CastingDirector): ProfileCheck[] => personChecks(castingDirector)

export const castingDirectorFacts = (castingDirector: CastingDirector) => onlyFilled(personFacts(castingDirector))