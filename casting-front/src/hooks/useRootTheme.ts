import { useLayoutEffect } from 'react'

export function useRootTheme(themeClassName: string) {
  useLayoutEffect(() => {
    const root = document.documentElement
    const previous = root.className

    root.className = themeClassName
    return () => {
      root.className = previous
    }
  }, [themeClassName])
}