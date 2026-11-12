import { formatDate } from '@/lib/format'
import type { RoleApplication } from '@/types/application'

export const applicationNote = (application: RoleApplication) =>
  application.proposedByName
    ? `Proposed by ${application.proposedByName}`
    : `Applied ${formatDate(application.createdAt)}`

export const proposalNote = (application: RoleApplication) => `Proposed ${formatDate(application.createdAt)}`