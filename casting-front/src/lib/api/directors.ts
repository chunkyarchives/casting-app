import type { Director, UpdateDirectorRequest } from '@/types/director'
import { request } from './http'

export const directorsApi = {
  get: (id: string) => request<Director>(`/api/directors/${id}`),

  update: (id: string, body: UpdateDirectorRequest) =>
    request<Director>(`/api/directors/${id}`, { method: 'PUT', body }),
}