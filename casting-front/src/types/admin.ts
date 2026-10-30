export type AccountStats = {
  total: number
  actors: number
  directors: number
  castingDirectors: number
  admins: number
  locked: number
  incompleteProfiles: number
}

export type FilmStats = {
  total: number
  active: number
  archived: number
  openRoles: number
  filledRoles: number
}

export type ApplicationStats = {
  total: number
  proposed: number
  accepted: number
  rejected: number
}

export type ChatStats = {
  conversations: number
  messages: number
}

export type MediaStats = {
  files: number
  totalBytes: number
}

export type AdminStats = {
  accounts: AccountStats
  films: FilmStats
  applications: ApplicationStats
  chat: ChatStats
  media: MediaStats
}

export type TimelinePoint = {
  date: string // "2026-10-28" (DateOnly on the backend)
  registrations: number
  films: number
  messages: number
}