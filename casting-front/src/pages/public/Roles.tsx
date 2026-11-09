import { MaskTheater01Icon } from '@hugeicons/core-free-icons'
import { useAuthDrawer } from '@/components/auth/drawer/auth-context'
import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { LoadError } from '@/components/common/states/LoadError'
import { CardGrid, CardGridSkeleton } from '@/components/public/CardGrid'
import { PublicPage } from '@/components/public/PublicPage'
import { RoleCard } from '@/components/public/RoleCard'
import { Button } from '@/components/ui/button'
import { useApiQuery } from '@/hooks/useApiQuery'
import { publicApi } from '@/lib/api/public'

const popularRolesLimit = 12
const gridClassName = 'md:grid-cols-2 lg:grid-cols-3'

export default function Roles() {
  const participant = useCurrentParticipant()
  const { openAuth } = useAuthDrawer()
  const roles = useApiQuery('public-popular-roles', () => publicApi.popularRoles(popularRolesLimit))

  return (
    <PublicPage title="Roles" description="The open roles with the most applications right now.">
      {roles.status === 'loading' && <CardGridSkeleton className={gridClassName} itemClassName="h-40" />}

      {roles.status === 'error' && (
        <LoadError title="Roles could not be loaded" error={roles.error} onRetry={roles.reload} />
      )}

      {roles.status === 'success' && roles.data.length === 0 && (
        <EmptyMessage
          icon={MaskTheater01Icon}
          title="No open roles yet"
          description="Roles show up here as soon as directors open them."
        />
      )}

      {roles.status === 'success' && roles.data.length > 0 && (
        <CardGrid className={gridClassName}>
          {roles.data.map((role, index) => (
            <li key={role.id}>
              <RoleCard role={role} rank={index + 1} />
            </li>
          ))}
        </CardGrid>
      )}

      {!participant && (
        <aside className="flex flex-col items-start gap-4 rounded-xl border bg-card p-6 sm:flex-row sm:items-center">
          <div className="flex flex-1 flex-col gap-1">
            <h2 className="text-lg font-bold">Want one of these roles?</h2>
            <p className="text-sm text-muted-foreground">Make a free actor profile and apply in a few minutes.</p>
          </div>
          <Button size="lg" onClick={() => openAuth('sign-up')}>
            Get started
          </Button>
        </aside>
      )}
    </PublicPage>
  )
}