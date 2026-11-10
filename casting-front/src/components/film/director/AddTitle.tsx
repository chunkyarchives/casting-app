import { PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'

type Props = {
  to: string
  label: string
  shape: 'poster' | 'square'
}

export function AddTile({ to, label, shape }: Props) {
  return (
    <Link
      to={to}
      aria-label={label}
      title={label}
      className={cn(
        'flex w-full items-center justify-center rounded-xl border-2 border-dashed text-muted-foreground transition-colors duration-200 outline-none',
        'hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:border-primary focus-visible:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50',
        shape === 'poster' ? 'aspect-2/3' : 'aspect-square rounded-2xl',
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-full border-2 border-current">
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-6" />
      </span>
    </Link>
  )
}