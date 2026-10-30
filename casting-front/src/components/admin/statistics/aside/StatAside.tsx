import { Fragment, type ReactNode } from 'react'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'

export type StatAsideItem = {
  label: string
  value: ReactNode
}

type Props = {
  icon: IconSvgElement
  title: string
  items: StatAsideItem[]
  children?: ReactNode
}

export function StatAside({ icon, title, items, children }: Props) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <span className="flex items-center gap-2 font-medium">
        <HugeiconsIcon icon={icon} strokeWidth={2} className="size-4 text-muted-foreground" />
        {title}
      </span>

        <dl className="grid grid-cols-[auto_minmax(6rem,auto)] gap-x-8 gap-y-2">
        {items.map(({ label, value }) => (
          <Fragment key={label}>
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium tabular-nums">{value}</dd>
          </Fragment>
        ))}
      </dl>

      {children}
    </div>
  )
}