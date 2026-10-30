import { CountUp } from '@/components/common/CountUp'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { formatChange, formatShortDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  activityMetrics,
  isActivityMetric,
  summarizeMetric,
  type ActivityMetric,
  type ActivityPeriods,
} from './activity'

type Props = {
  periods: ActivityPeriods
  visible: ActivityMetric[]
  onVisibleChange: (metrics: ActivityMetric[]) => void
}

export function ActivitySummary({ periods, visible, onVisibleChange }: Props) {
  const handleValueChange = (values: unknown[]) => {
    const metrics = values.filter(isActivityMetric)
    if (metrics.length > 0) onVisibleChange(metrics)
  }

  return (
    <ToggleGroup
      multiple
      variant="outline"
      value={visible}
      onValueChange={handleValueChange}
      aria-label="Metrics shown in the chart"
      className="grid w-full grid-cols-1 sm:grid-cols-3"
    >
      {activityMetrics.map(({ key, label, color }) => {
        const summary = summarizeMetric(key, periods)

        return (
          <ToggleGroupItem
            key={key}
            value={key}
            className="h-auto flex-col items-start gap-1 px-4 py-3 text-left opacity-50 data-pressed:opacity-100"
          >
            <span className="flex items-center gap-2 text-sm">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </span>
            <span className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold">
                <CountUp value={summary.total} />
              </span>
              <ChangeLabel change={summary.change} />
            </span>
            <span className="text-xs text-muted-foreground">
              {summary.peakDate ? `Peak: ${formatShortDate(summary.peakDate)}` : 'No activity'}
            </span>
          </ToggleGroupItem>
        )
      })}
    </ToggleGroup>
  )
}

function ChangeLabel({ change }: { change: MetricChange }) {
  if (change === undefined) return null
  if (change === null) return <span className="text-xs text-muted-foreground">new</span>

  return (
    <span
      className={cn(
        'text-xs',
        change > 0 && 'text-emerald-700',
        change < 0 && 'text-destructive',
        change === 0 && 'text-muted-foreground',
      )}
    >
      {formatChange(change)}
    </span>
  )
}

type MetricChange = ReturnType<typeof summarizeMetric>['change']