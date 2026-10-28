import { useNavigate } from 'react-router'
import { roleHomePath } from '@/lib/routes'
import type { ParticipantRole } from '@/types/participant'

export function useGoToRoleHome() {
  const navigate = useNavigate()
  return (role: ParticipantRole) => navigate(roleHomePath(role))
}