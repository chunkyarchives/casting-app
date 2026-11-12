import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { RoleApplication } from '@/types/application'
import { DecisionDialog } from './DecisionDialog'
import { decisionButtonClass, stripButtonClass, type Decision } from './strip-styles'

type Props = {
  application: RoleApplication
  onDecided: (application: RoleApplication, decision: Decision) => void
  onFailed: () => void
}

export function DecisionButtons({ application, onDecided, onFailed }: Props) {
  const [decision, setDecision] = useState<Decision | null>(null)

  return (
    <>
      <Button size="sm" className={cn(stripButtonClass, decisionButtonClass.accept)} onClick={() => setDecision('accept')}>
        Accept
      </Button>
      <Button size="sm" className={cn(stripButtonClass, decisionButtonClass.reject)} onClick={() => setDecision('reject')}>
        Reject
      </Button>

      <DecisionDialog
        application={application}
        decision={decision}
        onClose={() => setDecision(null)}
        onDecided={(made) => onDecided(application, made)}
        onFailed={onFailed}
      />
    </>
  )
}