import { toByteSize, type ByteUnit } from '@/lib/format'

type Props = {
  bytes: number
  unit: ByteUnit
}

export function ByteSizeValue({ bytes, unit }: Props) {
  const size = toByteSize(bytes, unit)

  return (
    <>
      {size.belowSmallest && (
        <span className="relative -top-[0.1em] mr-1">&lt;</span>
      )}
      {size.amount} {size.unit}
    </>
  )
}