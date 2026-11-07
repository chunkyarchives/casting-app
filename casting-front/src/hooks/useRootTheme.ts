import { useLayoutEffect } from 'react'

export function useRootTheme(className: string | null) {
  useLayoutEffect(() => {
    if (className !== null) document.documentElement.className = className
  }, [className])
}