import type { ReactNode } from 'react'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'

type Props = {
  title: string
  icon: IconSvgElement
  children?: ReactNode
}

export function SettingsScreen({ title, icon, children }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 pt-2 pb-6">
      <header className="flex items-center gap-4">
        <span className="flex size-8 shrink-0 rotate-45 items-center justify-center rounded-sm border-2 border-primary">
          <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4 -rotate-45" />
        </span>
        <h1 className="text-4xl font-bold">{title}</h1>
      </header>
      {children}
    </div>
  )
}