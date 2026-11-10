import type { MediaItem } from '@/types/media'

export type FilmStatus = 'Active' | 'Archived'
export type FilmRoleStatus = 'Open' | 'Filled'

export type FilmRole = {
  id: string
  filmId: string
  name: string
  description: string | null
  ageMin: number | null
  ageMax: number | null
  heightMin: number | null
  heightMax: number | null
  weightMin: number | null
  weightMax: number | null
  gender: string | null
  origin: string | null
  status: FilmRoleStatus
  rowVersion: number
  conceptArt: MediaItem[]
}

export type FilmSummary = {
  id: string
  directorId: string
  title: string
  contentRating: string | null
  releaseYear: number | null
  status: FilmStatus
  createdAt: string
  roleCount: number
  posterUrl: string | null
}

export type SaveFilmRequest = {
  title: string
  description: string | null
  contentRating: string | null
  releaseYear: number | null
}

export type UpdateFilmRequest = SaveFilmRequest & {
  status: FilmStatus
}

export type SaveFilmRoleRequest = {
  name: string
  description: string | null
  ageMin: number | null
  ageMax: number | null
  heightMin: number | null
  heightMax: number | null
  weightMin: number | null
  weightMax: number | null
  gender: string | null
  origin: string | null
}

export type UpdateFilmRoleRequest = SaveFilmRoleRequest & {
  rowVersion: number
}

export type Film = {
  id: string
  directorId: string
  title: string
  description: string | null
  contentRating: string | null
  releaseYear: number | null
  status: FilmStatus
  createdAt: string
  roles: FilmRole[]
  posterUrl: string | null
}