import type { CurrentParticipant, SignInRequest } from '@/types/participant'
import { request } from './http'

export const authApi = {
  signIn: (body: SignInRequest) =>
    request<CurrentParticipant>('/api/auth/login', {
      method: 'POST',
      body,
      refreshOnUnauthorized: false,
    }),

  signOut: () =>
    request<void>('/api/auth/logout', { method: 'POST', refreshOnUnauthorized: false }),

  getMe: () => request<CurrentParticipant>('/api/auth/me'),
}