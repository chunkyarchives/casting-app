export type CastingDirector = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string | null
  age: number | null
  gender: string | null
}

export type UpdateCastingDirectorRequest = Pick<CastingDirector, 'dateOfBirth' | 'gender'>