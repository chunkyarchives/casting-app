import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  to: string
  label: string
  prominent?: boolean
}

export function BackButton({ to, label, prominent = false }: Props) {
  return (
    <Link
      to={to}
      className={cn(
        prominent
          ? buttonVariants({ variant: 'outline', size: 'lg' })
          : cn(buttonVariants({ variant: 'ghost', size: 'sm' }), '-ml-3'),
        'self-start',
      )}
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} data-icon="inline-start" />
      {label}
    </Link>
  )
}