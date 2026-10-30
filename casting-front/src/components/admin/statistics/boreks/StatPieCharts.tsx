import type { ReactNode } from 'react'
import { Pie, PieChart } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { formatCount, formatPercent } from '@/lib/format'
import type { PieNote, PieSlice, StatPie } from './stat-pies'

const sliceColor = (index: number) => `var(--chart-${index + 1})`

type Props = {
  pies: StatPie[]
  children?: ReactNode
}

export function StatPieCharts({ pies, children }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-24 gap-y-12 py-4">
      {pies.map((pie, index) => (
        <StatPieChart key={pie.title ?? index} pie={pie} />
      ))}
      {children}
    </div>
  )
}

function StatPieChart({ pie }: { pie: StatPie }) {
  const chartConfig: ChartConfig = Object.fromEntries(
    pie.slices.map((slice, index) => [slice.key, { label: slice.label, color: sliceColor(index) }]),
  )
  const data = pie.slices
    .filter((slice) => slice.value > 0)
    .map((slice) => ({ ...slice, fill: `var(--color-${slice.key})` }))

  return (
    <figure className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
      {pie.total > 0 ? (
        <ChartContainer config={chartConfig} className="aspect-square h-48">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="key"
              startAngle={90}
              endAngle={-270}
              stroke={data.length > 1 ? 'var(--background)' : 'none'}
              strokeWidth={2}
            />
          </PieChart>
        </ChartContainer>
      ) : (
        <div aria-hidden className="size-48 rounded-full bg-muted" />
      )}

      <figcaption className="flex flex-col gap-3 text-sm">
        {pie.title && <span className="font-medium">{pie.title}</span>}
        <PieLegend slices={pie.slices} notes={pie.notes} />
      </figcaption>
    </figure>
  )
}

function PieLegend({ slices, notes }: { slices: PieSlice[]; notes?: PieNote[] }) {
  return (
    <div className="grid grid-cols-[auto_auto_auto_auto] gap-x-3 gap-y-2">
      <ul className="col-span-4 grid grid-cols-subgrid gap-y-2">
        {slices.map((slice, index) => (
          <li key={slice.key} className="col-span-4 grid grid-cols-subgrid items-center">
            <span aria-hidden className="size-2.5 rounded-full" style={{ backgroundColor: sliceColor(index) }} />
            <LegendRow label={slice.label} value={slice.value} share={slice.share} />
          </li>
        ))}
      </ul>

      {notes && (
        <ul className="col-span-4 mt-1 grid grid-cols-subgrid gap-y-2 border-t pt-3 text-muted-foreground">
          {notes.map((note) => (
            <li key={note.label} className="col-span-4 grid grid-cols-subgrid items-center">
              <span />
              <LegendRow label={note.label} value={note.value} share={note.share} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function LegendRow({ label, value, share }: { label: string; value: number; share: number }) {
  return (
    <>
      <span className="pr-6">{label}</span>
      <span className="text-right font-medium tabular-nums">{formatCount(value)}</span>
      <span className="text-right text-muted-foreground tabular-nums">{formatPercent(share)}</span>
    </>
  )
}