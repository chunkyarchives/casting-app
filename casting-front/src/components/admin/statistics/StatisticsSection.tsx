import type { ReactNode } from 'react'
import { CountUp } from '@/components/common/display/CountUp'
import { SectionHeader } from '../SectionHeader'
import { statisticsSectionTitles, type StatisticsSectionId } from './sections'

type Props = {
  id: StatisticsSectionId
  count?: number
  children: ReactNode
}

export function StatisticsSection({ id, count, children }: Props) {
  const titleId = `${id}-title`

  return (
    <section aria-labelledby={titleId}>
      <SectionHeader
        id={titleId}
        title={statisticsSectionTitles[id]}
        aside={count === undefined ? undefined : <CountUp value={count} />}
      />
      {children}
    </section>
  )
}