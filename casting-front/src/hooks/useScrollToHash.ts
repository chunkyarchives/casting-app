import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { prefersReducedMotion } from '@/lib/motion'

export function useScrollToHash(ready: boolean) {
  const { hash, key } = useLocation()

  useEffect(() => {
    if (!ready || !hash) return

    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [ready, hash, key])
}