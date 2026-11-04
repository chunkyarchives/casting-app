import { useLayoutEffect } from 'react'
import { themes, type Theme } from '@/lib/themes'

export function useRootTheme(theme: Theme) {
  useLayoutEffect(() => {
    const root = document.documentElement

    root.className = theme
    return () => {
      root.className = themes.site
    }
  }, [theme])
}