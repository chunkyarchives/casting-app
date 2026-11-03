import { useCountUp } from '@/hooks/useCountUp'
import { formatCount } from '@/lib/format'

type Props = {
  value: number
}

export function CountUp({ value }: Props) {
  const current = useCountUp(value)

  return (
    <span className="tabular-nums">
      <span aria-hidden>{formatCount(current)}</span>
      <span className="sr-only">{formatCount(value)}</span>
    </span>
  )
}