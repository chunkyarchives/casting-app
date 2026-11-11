import type { ReactNode } from 'react'
import { SectionHeader } from '../SectionHeader'
import { statisticsSectionTitles, type StatisticsSectionId } from './sections'

type Props = {
  id: StatisticsSectionId
  children: ReactNode
}

export function StatisticsSection({ id, children }: Props) {
  const titleId = `${id}-title`

  return (
    <section aria-labelledby={titleId}>
      <SectionHeader id={titleId} title={statisticsSectionTitles[id]} />
      {children}
    </section>
  )
}