import { Spinner } from '@/components/ui/spinner'
import { useDelay } from '@/hooks/useDelay'
import { cn } from '@/lib/utils'

const spinnerDelayMs = 50

type Props = {
  className?: string
}

export function PageLoader({ className }: Props) {
  const slow = useDelay(spinnerDelayMs)

  return (
    <div className={cn('flex flex-1 items-center justify-center p-12', className)}>
      {slow && <Spinner className="size-6 text-muted-foreground" />}
    </div>
  )
}