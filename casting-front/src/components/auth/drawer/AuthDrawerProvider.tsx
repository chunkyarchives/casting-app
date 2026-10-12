import { useState, type ReactNode } from 'react'
import { AuthDrawerContext, type AuthTab } from './auth-context.ts'
import { AuthDrawer } from './AuthDrawer.tsx'

export function AuthDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<AuthTab>('sign-in')

  const openAuth = (nextTab: AuthTab) => {
    setTab(nextTab)
    setOpen(true)
  }

  return (
    <AuthDrawerContext value={{ openAuth }}>
      {children}
      <AuthDrawer open={open} onOpenChange={setOpen} tab={tab} onTabChange={setTab} />
    </AuthDrawerContext>
  )
}