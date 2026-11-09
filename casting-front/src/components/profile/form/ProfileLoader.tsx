import type { ReactNode } from 'react'
import { LoadError } from '@/components/common/states/LoadError'
import { Skeleton } from '@/components/ui/skeleton'
import { useApiQuery } from '@/hooks/useApiQuery'

type Props<TProfile> = {
  cacheKey: string
  load: () => Promise<TProfile>
  children: (profile: TProfile, reload: () => void) => ReactNode
}

export function ProfileLoader<TProfile>({ cacheKey, load, children }: Props<TProfile>) {
  const profile = useApiQuery(cacheKey, load)

  if (profile.status === 'loading') return <Skeleton className="h-52 rounded-xl" />
  if (profile.status === 'error') {
    return <LoadError title="Your profile could not be loaded" error={profile.error} onRetry={profile.reload} />
  }

  return children(profile.data, profile.reload)
}