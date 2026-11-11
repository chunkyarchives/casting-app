import type { ReactNode } from 'react'

export function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1">
      <h2 className="px-4 pb-3 text-sm text-muted-foreground">{title}</h2>
      {children}
    </section>
  )
}