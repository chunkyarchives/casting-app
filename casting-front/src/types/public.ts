import type { ParticipantRole } from './participant'

export type PublicFilm = {
  id: string
  title: string
  description: string | null
  contentRating: string | null
  releaseYear: number | null
  directorName: string
  posterUrl: string | null
  openRoles: number
}

export type PublicRole = {
  id: string
  name: string
  description: string | null
  gender: string | null
  origin: string | null
  ageMin: number | null
  ageMax: number | null
  filmId: string
  filmTitle: string
  posterUrl: string | null
  applications: number
}

export type PublicPerson = {
  id: string
  firstName: string
  lastName: string
  role: ParticipantRole
  profilePictureUrl: string | null
  origin: string | null
  age: number | null
  bio: string | null
}