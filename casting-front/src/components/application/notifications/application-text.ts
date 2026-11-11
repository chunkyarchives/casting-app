import type { RoleApplication } from '@/types/application'

export function applicationTitle(application: RoleApplication) {
  if (application.proposedByName) {
    return `${application.proposedByName} proposed ${application.actorName} for ${application.filmRoleName}`
  }
  return `${application.actorName} applied for ${application.filmRoleName}`
}