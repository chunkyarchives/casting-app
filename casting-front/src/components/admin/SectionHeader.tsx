import type { ReactNode } from 'react'

type Props = {
  id: string
  title: string
  as?: 'h1' | 'h2'
  aside?: ReactNode
}

export function SectionHeader({ id, title, as: Heading = 'h2', aside }: Props) {
  return (
    <header className="mb-6 flex items-baseline gap-3 border-b pb-2">
      <Heading id={id} className="text-xl font-semibold">
        {title}
      </Heading>
      {aside !== undefined && <span className="text-xl text-muted-foreground">{aside}</span>}
    </header>
  )
}