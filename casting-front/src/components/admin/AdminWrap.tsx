import type { ReactNode } from 'react'

export function AdminWrap({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 p-6">{children}</div>
}