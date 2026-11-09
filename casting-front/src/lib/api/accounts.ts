import type { DeactivateAccountRequest, DeleteAccountRequest } from '@/types/account'
import type { CurrentParticipant } from '@/types/participant'
import { request } from './http'

export const accountApi = {
  updateVisibility: (isProfilePublic: boolean) =>
    request<CurrentParticipant>('/api/me/visibility', { method: 'PUT', body: { isProfilePublic } }),

  deactivate: (body: DeactivateAccountRequest) =>
    request<void>('/api/me/deactivate', { method: 'POST', body }),

  remove: (body: DeleteAccountRequest) =>
    request<void>('/api/me', { method: 'DELETE', body }),
}