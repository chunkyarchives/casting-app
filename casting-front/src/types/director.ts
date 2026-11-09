export type Director = {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string | null
  age: number | null
  origin: string | null
  gender: string | null
  bio: string | null
}

export type UpdateDirectorRequest = Pick<Director, 'dateOfBirth' | 'origin' | 'gender' | 'bio'>