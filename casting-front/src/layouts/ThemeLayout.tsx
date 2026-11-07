import { useEffect } from 'react'
import { Outlet } from 'react-router'
import { useSession } from '@/components/auth/session/session-context'
import { useRootTheme } from '@/hooks/useRootTheme'
import { useSiteTheme } from '@/hooks/useSiteTheme'
import { rememberBootTheme } from '@/lib/theme-preference'

export default function ThemeLayout() {
  const { status } = useSession()
  const [theme] = useSiteTheme()

  const className = status === 'ready' ? theme.className : null

  useRootTheme(className)
  useEffect(() => {
    if (className !== null) rememberBootTheme(className)
  }, [className])

  return <Outlet />
}