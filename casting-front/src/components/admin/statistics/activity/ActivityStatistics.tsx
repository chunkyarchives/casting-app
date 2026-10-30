import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useApiQuery } from '@/hooks/useApiQuery'
import { adminApi } from '@/lib/api/admin'
import { apiErrorMessage } from '@/lib/api/errors'
import type { TimelinePoint } from '@/types/admin'
import {
  activityMetrics,
  canComparePeriods,
  hasActivity,
  splitPeriods,
  toRunningTotals,
  type ActivityMetric,
} from './activity'
import { ActivityChart } from './ActivityChart'
import { ActivitySummary } from './ActivitySummary'

const dayOptions = [7, 30, 90] as const
type Days = (typeof dayOptions)[number]

const viewOptions = [
  { value: 'daily', label: 'Per day' },
  { value: 'running', label: 'Running total' },
] as const
type View = (typeof viewOptions)[number]['value']

const parseDays = (value: unknown): Days | undefined =>
  dayOptions.find((days) => String(days) === value)
const parseView = (value: unknown): View | undefined =>
  viewOptions.find((option) => option.value === value)?.value

export function ActivityStatistics() {
  const [days, setDays] = useState<Days>(30)
  const [view, setView] = useState<View>('daily')
  const [visible, setVisible] = useState<ActivityMetric[]>(() => activityMetrics.map(({ key }) => key))

  const fetchDays = canComparePeriods(days) ? days * 2 : days
  const timeline = useApiQuery(`admin-timeline-${fetchDays}`, () => adminApi.getTimeline(fetchDays))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ToggleGroup
          variant="outline"
          size="sm"
          value={[String(days)]}
          onValueChange={(value) => setDays(parseDays(value[0]) ?? days)}
          aria-label="Period"
        >
          {dayOptions.map((option) => (
            <ToggleGroupItem key={option} value={String(option)}>
              {option} days
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <ToggleGroup
          variant="outline"
          size="sm"
          value={[view]}
          onValueChange={(value) => setView(parseView(value[0]) ?? view)}
          aria-label="Values"
        >
          {viewOptions.map(({ value, label }) => (
            <ToggleGroupItem key={value} value={value}>
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {timeline.status === 'loading' && <Skeleton className="h-96 w-full" />}

      {timeline.status === 'error' && (
        <p className="text-sm text-destructive">{apiErrorMessage(timeline.error)}</p>
      )}

      {timeline.status === 'success' && (
        <ActivityPeriod
          points={timeline.data}
          days={days}
          view={view}
          visible={visible}
          onVisibleChange={setVisible}
        />
      )}
    </div>
  )
}

type ActivityPeriodProps = {
  points: TimelinePoint[]
  days: Days
  view: View
  visible: ActivityMetric[]
  onVisibleChange: (metrics: ActivityMetric[]) => void
}

function ActivityPeriod({ points, days, view, visible, onVisibleChange }: ActivityPeriodProps) {
  const periods = splitPeriods(points, days)

  return (
    <>
      <ActivitySummary periods={periods} visible={visible} onVisibleChange={onVisibleChange} />
      {periods.previous && (
        <p className="text-xs text-muted-foreground">Change compared with the previous {days} days.</p>
      )}

      {hasActivity(periods.current) ? (
        <ActivityChart
          key={`${view}-${visible.join()}`}
          points={view === 'running' ? toRunningTotals(periods.current) : periods.current}
          visible={visible}
        />
      ) : (
        <p className="py-16 text-center text-sm text-muted-foreground">
          No activity in the last {days} days.
        </p>
      )}
    </>
  )
}