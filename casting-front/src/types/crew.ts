export type CrewDirector = {
  id: string
  firstName: string
  lastName: string
}

export type CrewMember = {
  castingDirectorId: string
  firstName: string
  lastName: string
  joinedAt: string
}

export type CrewChange = 'Joined' | 'Left' | 'Removed'

export type CrewMemberChange = {
  crewId: string
  productionName: string
  change: CrewChange
  castingDirectorId: string
  firstName: string
  lastName: string
}

export type Crew = {
  id: string
  directorId: string
  director: CrewDirector
  productionName: string
  productionCode: string | null
  createdAt: string
  members: CrewMember[]
}