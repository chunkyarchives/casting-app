import { createContext, useContext } from 'react'

export type AuthTab = 'sign-in' | 'sign-up'

type AuthDrawerContextValue = {
  openAuth: (tab: AuthTab) => void
}

export const AuthDrawerContext = createContext<AuthDrawerContextValue | null>(null)

export function useAuthDrawer() {
  const ctx = useContext(AuthDrawerContext)
  if (!ctx) throw new Error('useAuthDrawer must be used inside <AuthDrawerProvider>')
  return ctx
}