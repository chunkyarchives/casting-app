import type { CurrentParticipant, SignInRequest, SignUpRequest, UpdateNameRequest } from '@/types/participant'
import { request } from './http'

export const authApi = {
  signIn: (body: SignInRequest) =>
    request<CurrentParticipant>('/api/auth/login', {
      method: 'POST',
      body,
      refreshOnUnauthorized: false,
    }),

  signUp: (body: SignUpRequest) =>
    request<CurrentParticipant>('/api/auth/register', {
      method: 'POST',
      body,
      refreshOnUnauthorized: false,
    }),

  signOut: () =>
    request<void>('/api/auth/logout', { method: 'POST', refreshOnUnauthorized: false }),

  getMe: () => 
    request<CurrentParticipant>('/api/auth/me'),

  updateName: (body: UpdateNameRequest) =>
    request<CurrentParticipant>('/api/auth/me/name', { method: 'PUT', body }),
}