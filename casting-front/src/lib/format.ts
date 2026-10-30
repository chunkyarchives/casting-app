const countFormat = new Intl.NumberFormat('en')
const percentFormat = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 0 })
const sizeFormat = new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const shortDateFormat = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' })

export const formatCount = (value: number) => countFormat.format(value)

export const formatPercent = (share: number) => percentFormat.format(share)

const multiplierFormat = new Intl.NumberFormat('en', { maximumFractionDigits: 1 })

export type ByteUnit = 'MB' | 'GB'

const bytesPerUnit: Record<ByteUnit, number> = {
  MB: 1024 ** 2,
  GB: 1024 ** 3,
}

export type ByteSize = {
  belowSmallest: boolean
  amount: string
  unit: ByteUnit
}

export function toByteSize(bytes: number, unit: ByteUnit): ByteSize {
  const size = bytes / bytesPerUnit[unit]
  const belowSmallest = bytes > 0 && size < 0.005

  return {
    belowSmallest,
    amount: sizeFormat.format(belowSmallest ? 0.01 : size),
    unit,
  }
}

export function formatShortDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return shortDateFormat.format(new Date(year, month - 1, day))
}

export function formatChange(change: number) {
  if (change === 0) return formatPercent(0)
  if (change >= 1) return `↑ ${multiplierFormat.format(change + 1)}×`
  return `${change > 0 ? '↑' : '↓'} ${formatPercent(Math.abs(change))}`
}