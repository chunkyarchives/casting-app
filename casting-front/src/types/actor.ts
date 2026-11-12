export type ActorLink = {
  label: string
  url: string
}

export type Actor = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string | null
  age: number | null
  height: number | null
  weight: number | null
  origin: string | null
  gender: string | null
  bio: string | null
  links: ActorLink[]
  roleInterests: string[]
}

export type ActorSummary = Pick<Actor, 'id' | 'firstName' | 'lastName' | 'age' | 'height' | 'weight' | 'origin' | 'gender'>

export type ActorListQuery = {
  search?: string
  page: number
  pageSize: number
}

export type UpdateActorRequest = Pick<Actor,'dateOfBirth' | 'height' | 'weight' | 'origin' | 'gender' | 'bio' | 'links' | 'roleInterests'>