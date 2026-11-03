import { useEffect, useState } from 'react'

export function useDelay(ms: number) {
  const [passed, setPassed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setPassed(true), ms)
    return () => clearTimeout(timer)
  }, [ms])

  return passed
}