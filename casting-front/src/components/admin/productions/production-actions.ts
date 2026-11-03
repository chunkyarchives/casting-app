import type { ReasonAction } from '@/components/admin/ReasonDialog'
import { adminApi } from '@/lib/api/admin'
import type { AdminCrew, AdminCrewMember, AdminFilm } from '@/types/admin'

type CrewRef = Pick<AdminCrew, 'id' | 'productionName'>
type FilmRef = Pick<AdminFilm, 'id' | 'title'>

export type ProductionAction =
  | { kind: 'regenerateCode'; crew: CrewRef }
  | { kind: 'removeMember'; crew: CrewRef; member: AdminCrewMember }
  | { kind: 'deleteCrew'; crew: CrewRef }
  | { kind: 'deleteFilm'; film: FilmRef }

export const memberName = (member: Pick<AdminCrewMember, 'firstName' | 'lastName'>) => `${member.firstName} ${member.lastName}`

export function describeAction(action: ProductionAction): ReasonAction {
  switch (action.kind) {
    case 'regenerateCode':
      return {
        title: `New code for ${action.crew.productionName}?`,
        description: 'The current code stops working right away. Casting directors who already joined stay in the production.',
        confirmLabel: 'Regenerate code',
        pendingLabel: 'Regenerating…',
        reasonRequired: false,
        destructive: false,
        run: async (reason) => {
          const { productionCode } = await adminApi.regenerateCrewCode(action.crew.id, reason || undefined)
          return `New code: ${productionCode}`
        },
      }

    case 'removeMember':
      return {
        title: `Remove ${memberName(action.member)} from ${action.crew.productionName}?`,
        description: 'They lose access to the production right away. The current code still lets them join again, so regenerate it if they should not come back.',
        confirmLabel: 'Remove member',
        pendingLabel: 'Removing…',
        reasonRequired: true,
        destructive: true,
        run: async (reason) => {
          await adminApi.removeCrewMember(action.crew.id, action.member.castingDirectorId, reason)
          return 'Member removed'
        },
      }

    case 'deleteCrew':
      return {
        title: `Delete ${action.crew.productionName}?`,
        description: 'The production, its code and all memberships are deleted. The director keeps their films and can start a new production.',
        confirmLabel: 'Delete production',
        pendingLabel: 'Deleting…',
        reasonRequired: true,
        destructive: true,
        run: async (reason) => {
          await adminApi.deleteCrew(action.crew.id, reason)
          return 'Production deleted'
        },
      }

    case 'deleteFilm':
      return {
        title: `Delete ${action.film.title}?`,
        description: 'The film is deleted permanently, together with its roles, applications, poster and concept art. This cannot be undone.',
        confirmLabel: 'Delete film',
        pendingLabel: 'Deleting…',
        reasonRequired: true,
        destructive: true,
        run: async (reason) => {
          await adminApi.deleteFilm(action.film.id, reason)
          return 'Film deleted'
        },
      }
  }
}