import type { TimelinePoint } from '@/types/admin'

export type ActivityMetric = Exclude<keyof TimelinePoint, 'date'>

export const activityMetrics: { key: ActivityMetric; label: string; color: string }[] = [
  { key: 'registrations', label: 'Registrations', color: 'var(--chart-1)' },
  { key: 'films', label: 'Films', color: 'var(--chart-2)' },
  { key: 'messages', label: 'Messages', color: 'var(--chart-3)' },
]

export const isActivityMetric = (value: unknown): value is ActivityMetric =>
  activityMetrics.some(({ key }) => key === value)

const maxTimelineDays = 90

export const canComparePeriods = (days: number) => days * 2 <= maxTimelineDays

export type ActivityPeriods = {
  current: TimelinePoint[]
  previous?: TimelinePoint[]
}

export function splitPeriods(points: TimelinePoint[], days: number): ActivityPeriods {
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date))

  return {
    current: sorted.slice(-days),
    previous: canComparePeriods(days) ? sorted.slice(-days * 2, -days) : undefined,
  }
}

export type MetricSummary = {
  total: number
  change?: number | null
  peakDate?: string
}

const sumOf = (points: TimelinePoint[], metric: ActivityMetric) =>
  points.reduce((total, point) => total + point[metric], 0)

export function summarizeMetric(metric: ActivityMetric, { current, previous }: ActivityPeriods): MetricSummary {
  const total = sumOf(current, metric)
  const peak = current.reduce<TimelinePoint | undefined>(
    (best, point) => (point[metric] > (best?.[metric] ?? 0) ? point : best),
    undefined,
  )

  if (!previous) return { total, peakDate: peak?.date }

  const previousTotal = sumOf(previous, metric)
  const change =
    previousTotal === 0 ? (total === 0 ? 0 : null) : (total - previousTotal) / previousTotal

  return { total, change, peakDate: peak?.date }
}

export const hasActivity = (points: TimelinePoint[]) =>
  points.some((point) => activityMetrics.some(({ key }) => point[key] > 0))

export function toRunningTotals(points: TimelinePoint[]): TimelinePoint[] {
  const running: Record<ActivityMetric, number> = { registrations: 0, films: 0, messages: 0 }

  return points.map((point) => {
    for (const { key } of activityMetrics) running[key] += point[key]
    return { date: point.date, ...running }
  })
}