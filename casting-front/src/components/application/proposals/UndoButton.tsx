import { useState } from 'react'
import { Undo02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { stripButtonClass } from '@/components/application/board/strip-styles'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { applicationsApi } from '@/lib/api/applications'
import { apiErrorMessage } from '@/lib/api/errors'
import { cn } from '@/lib/utils'
import type { RoleApplication } from '@/types/application'

type Props = {
  application: RoleApplication
  onUndone: (application: RoleApplication) => void
}

export function UndoButton({ application, onUndone }: Props) {
  const [pending, setPending] = useState(false)

  const undo = async () => {
    setPending(true)
    const undone = await applicationsApi.withdraw(application.id).then(
      () => true,
      (error: unknown) => {
        toast.add({ type: 'error', title: 'The proposal could not be undone', description: apiErrorMessage(error) })
        return false
      },
    )
    setPending(false)
    if (undone) onUndone(application)
  }

  return (
    <Button
      size="sm"
      className={cn(stripButtonClass, 'sm:min-w-28')}
      disabled={pending}
      aria-label={`Undo the proposal of ${application.actorName} for ${application.filmRoleName}`}
      onClick={() => void undo()}
    >
      <HugeiconsIcon icon={Undo02Icon} strokeWidth={2} data-icon="inline-start" />
      {pending ? 'Undoing…' : 'Undo'}
    </Button>
  )
}