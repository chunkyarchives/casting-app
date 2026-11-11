import { PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'

type Shape = 'poster' | 'square' | 'video'

type Props = {
  label: string
  shape: Shape
  disabled?: boolean
} & ({ to: string; onClick?: never } | { onClick: () => void; to?: never })

const shapeClass: Record<Shape, string> = {
  poster: 'aspect-2/3 rounded-xl',
  square: 'aspect-square rounded-2xl',
  video: 'aspect-video rounded-2xl',
}

const tileClass =
  'flex w-full items-center justify-center border-2 border-dashed text-muted-foreground transition-colors duration-200 outline-none hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:border-primary focus-visible:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50'

function PlusMark() {
  return (
    <span className="flex size-12 items-center justify-center rounded-full border-2 border-current">
      <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-6" />
    </span>
  )
}

export function AddTile({ label, shape, disabled = false, to, onClick }: Props) {
  const className = cn(tileClass, shapeClass[shape])

  if (to !== undefined) {
    return (
      <Link to={to} aria-label={label} title={label} className={className}>
        <PlusMark />
      </Link>
    )
  }

  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick} className={className}>
      <PlusMark />
    </button>
  )
}