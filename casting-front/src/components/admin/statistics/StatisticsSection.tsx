import type { ReactNode } from 'react'
import { CountUp } from '@/components/common/CountUp'
import { statisticsSectionTitles, type StatisticsSectionId } from './sections'

type Props = {
  id: StatisticsSectionId
  count?: number
  children: ReactNode
}

export function StatisticsSection({ id, count, children }: Props) {
  const titleId = `${id}-title`

  return (
    // scroll-mt: space above the title when a sidebar link scrolls here
    <section id={id} aria-labelledby={titleId} className="scroll-mt-6">
      <header className="mb-6 flex items-baseline gap-3 border-b pb-2">
        <h2 id={titleId} className="text-xl font-semibold">
          {statisticsSectionTitles[id]}
        </h2>
        {count !== undefined && (
          <span className="text-xl text-muted-foreground">
            <CountUp value={count} />
          </span>
        )}
      </header>

      {children}
    </section>
  )
}