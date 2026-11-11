import { MaskTheater01Icon } from '@hugeicons/core-free-icons'
import { SectionTitle } from '@/components/common/display/SectionTitle'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { LoadError } from '@/components/common/states/LoadError'
import { ApplyButton } from '@/components/film/actor/ApplyButton'
import { RoleCard } from '@/components/film/shared/RoleCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery'
import { filmRolesApi } from '@/lib/api/films'

const placeholders = Array.from({ length: 5 }, (_, index) => index)

export function ActorRoles() {
  const roles = useApiQuery('actor-open-roles', () => filmRolesApi.open())

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pt-2 pb-32">
      <SectionTitle as="h1" size="page">
        Roles
      </SectionTitle>

      {roles.status === 'loading' && (
        <ul aria-hidden className="grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] sm:gap-6">
          {placeholders.map((index) => (
            <li key={index}>
              <Skeleton className="aspect-square rounded-2xl" />
            </li>
          ))}
        </ul>
      )}
      {roles.status === 'error' && <LoadError title="Roles could not be loaded" error={roles.error} onRetry={roles.reload} />}
      {roles.status === 'success' && roles.data.length === 0 && (
        <EmptyMessage
          icon={MaskTheater01Icon}
          title="No open roles right now"
          description="When a director opens a new role, it shows up here."
        />
      )}
      {roles.status === 'success' && roles.data.length > 0 && (
        <ul className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] sm:gap-6">
          {roles.data.map((openRole) => (
            <li key={openRole.role.id}>
              <RoleCard
                role={openRole.role}
                subtitle={openRole.filmTitle}
                footer={
                  <ApplyButton
                    openRole={openRole}
                    onApplied={(roleId) => roles.setData(roles.data.filter((item) => item.role.id !== roleId))}
                  />
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}