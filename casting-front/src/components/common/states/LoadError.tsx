import { Alert02Icon } from '@hugeicons/core-free-icons'
import { EmptyMessage } from '@/components/common/states/EmptyMessage'
import { Button } from '@/components/ui/button'
import { apiErrorMessage } from '@/lib/api/errors'

type Props = {
  title: string
  error: unknown
  onRetry: () => void
  className?: string
}

export function LoadError({ title, error, onRetry, className }: Props) {
  return (
    <EmptyMessage icon={Alert02Icon} title={title} description={apiErrorMessage(error)} className={className}>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </EmptyMessage>
  )
}