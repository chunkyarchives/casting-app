import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { applicationsApi } from '@/lib/api/applications'
import { apiErrorMessage } from '@/lib/api/errors'
import type { OpenRole } from '@/types/film'

type Props = {
  openRole: OpenRole
  onApplied: (roleId: string) => void
}

export function ApplyButton({ openRole, onApplied }: Props) {
  const [pending, setPending] = useState(false)
  const { role, filmTitle } = openRole

  const apply = async () => {
    setPending(true)
    try {
      await applicationsApi.apply(role.id)
      toast.add({ type: 'success', title: `You applied for ${role.name}`, description: filmTitle })
      onApplied(role.id)
    } catch (error) {
      toast.add({ type: 'error', title: `Applying for ${role.name} failed`, description: apiErrorMessage(error) })
      setPending(false)
    }
  }

  return (
    <Button type="button" className="w-full" disabled={pending} onClick={() => void apply()}>
      {pending ? 'Applying…' : 'Apply'}
    </Button>
  )
}