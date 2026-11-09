import { MaskTheater01Icon } from '@hugeicons/core-free-icons'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { LoadError } from '@/components/common/states/LoadError'
import { CardGrid, CardGridSkeleton } from '@/components/public/CardGrid'
import { PublicPage } from '@/components/public/PublicPage'
import { RoleCard } from '@/components/public/RoleCard'
import { popularRolesQuery } from '@/components/public/public-lists'
import { useApiQuery } from '@/hooks/useApiQuery'

const gridClassName = 'md:grid-cols-2 lg:grid-cols-3'

export default function Roles() {
  const query = popularRolesQuery()
  const roles = useApiQuery(query.key, query.load)

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
    </PublicPage>
  )
}