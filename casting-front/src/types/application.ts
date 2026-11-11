export type ApplicationStatus = 'Proposed' | 'Accepted' | 'Rejected'

export type RoleApplication = {
  id: string
  filmRoleId: string
  filmRoleName: string
  roleImageUrl: string | null
  filmId: string
  filmTitle: string
  actorId: string
  actorName: string
  proposedById: string | null
  proposedByName: string | null
  status: ApplicationStatus
  createdAt: string
  decidedAt: string | null
}