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