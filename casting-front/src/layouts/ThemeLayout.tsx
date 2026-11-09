import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { useSession } from '@/components/auth/session/session-context'
import { Toaster } from '@/components/ui/toast'
import { useRootTheme } from '@/hooks/useRootTheme'
import { useSiteTheme } from '@/hooks/useSiteTheme'
import { isDashboardPath } from '@/lib/routes'
import { rememberBootTheme } from '@/lib/theme-preference'
import { defaultSiteTheme } from '@/lib/themes'

export default function ThemeLayout() {
  const { status } = useSession()
  const [theme] = useSiteTheme()
  const { pathname } = useLocation()

  const participantTheme = status === 'ready' ? theme.className : null

  useRootTheme(isDashboardPath(pathname) ? participantTheme : defaultSiteTheme.className)
  useEffect(() => {
    if (participantTheme !== null) rememberBootTheme(participantTheme)
  }, [participantTheme])

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  )
}