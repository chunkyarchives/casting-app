import { Outlet } from 'react-router'
import { useRootTheme } from '@/hooks/useRootTheme'
import type { Theme } from '@/lib/themes'

type Props = {
  theme: Theme
}

export default function ThemeLayout({ theme }: Props) {
  useRootTheme(theme)
  return <Outlet />
}