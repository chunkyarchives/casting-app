import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { formatShortDate } from '@/lib/format'
import type { TimelinePoint } from '@/types/admin'
import { activityMetrics, type ActivityMetric } from './activity'

const chartConfig: ChartConfig = Object.fromEntries(
  activityMetrics.map(({ key, label, color }) => [key, { label, color }]),
)

type Props = {
  points: TimelinePoint[]
  visible: ActivityMetric[]
}

export function ActivityChart({ points, visible }: Props) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <LineChart data={points} margin={{ top: 8, left: 4, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          minTickGap={24}
          tickFormatter={formatShortDate}
        />
        <YAxis allowDecimals={false} axisLine={false} tickLine={false} width={32} />
        <ChartTooltip
          content={<ChartTooltipContent labelFormatter={(date) => formatShortDate(String(date))} />}
        />
        {activityMetrics
          .filter(({ key }) => visible.includes(key))
          .map(({ key }) => (
            <Line
              key={key}
              dataKey={key}
              type="monotone"
              stroke={`var(--color-${key})`}
              strokeWidth={2}
              dot={false}
            />
          ))}
      </LineChart>
    </ChartContainer>
  )
}