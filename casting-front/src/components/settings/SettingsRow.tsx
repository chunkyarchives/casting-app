import { use, type FocusEvent, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { SettingsHintContext } from './settings-hint'
import { slotClassName } from './slot-styles'

type Props = {
  label: string
  hint: string
  missing?: boolean
  error?: string
  align?: 'center' | 'start'
  children: ReactNode
}

export function SettingsRow({ label, hint, missing = false, error, align = 'center', children }: Props) {
  const onHint = use(SettingsHintContext)
  
  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(document.activeElement)) onHint(null)
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const row = event.currentTarget
    if (!row.contains(event.relatedTarget) && !row.matches(':hover')) onHint(null)
  }

  return (
    <div
      role="group"
      aria-label={label}
      onPointerEnter={() => onHint(hint)}
      onPointerLeave={handlePointerLeave}
      onFocus={() => onHint(hint)}
      onBlur={handleBlur}
      className={cn(slotClassName, 'grid gap-x-6 gap-y-2 px-4 py-2 md:grid-cols-2', align === 'start' ? 'items-start' : 'items-center')}
    >
      <div className="flex min-h-9 items-center gap-2">
        <span>{label}</span>
        {missing && (
          <span title="Needed for a complete profile" className="size-1.5 rounded-full bg-primary">
            <span className="sr-only">Needed for a complete profile</span>
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-1.5 font-normal text-foreground">
        {children}
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}