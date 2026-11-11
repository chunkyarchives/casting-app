import type { ReactNode } from 'react'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'

type Props = {
  title: string
  icon: IconSvgElement
  back?: ReactNode
  children?: ReactNode
}

export function SettingsScreen({ title, icon, back, children }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 pt-2 pb-6">
      <header className="flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-8 shrink-0 rotate-45 items-center justify-center rounded-sm border-2 border-primary">
            <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4 -rotate-45" />
          </span>
          <h1 className="text-4xl font-bold">{title}</h1>
        </div>
        {back}
      </header>
      {children}
    </div>
  )
}