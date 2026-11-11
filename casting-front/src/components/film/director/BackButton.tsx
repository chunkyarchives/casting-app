import { ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function BackButton({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'self-start')}>
      <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} data-icon="inline-start" />
      {label}
    </Link>
  )
}