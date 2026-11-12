import type { RoleApplication } from '@/types/application'

export function applicationTitle(application: RoleApplication) {
  if (application.proposedByName) {
    return `${application.proposedByName} proposed ${application.actorName} for ${application.filmRoleName}`
  }
  return `${application.actorName} applied for ${application.filmRoleName}`
}

export function withdrawalTitle(application: RoleApplication) {
  if (application.proposedByName) {
    return `${application.proposedByName} withdrew ${application.actorName} for ${application.filmRoleName}`
  }
  return `${application.actorName} withdrew from ${application.filmRoleName}`
}

export function proposalDecisionTitle(application: RoleApplication) {
  if (application.status === 'Accepted') return `${application.actorName} got the role of ${application.filmRoleName}`
  return `${application.actorName} was not picked for ${application.filmRoleName}`
}