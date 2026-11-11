import { useApiQuery } from '@/hooks/useApiQuery'
import { portfolioApi } from '@/lib/api/portfolio'
import type { MediaItem } from '@/types/media'

const oldestFirst = (items: MediaItem[]) => [...items].sort((a, b) => a.createdAt.localeCompare(b.createdAt))

export const usePhotos = (actorId: string) =>
  useApiQuery(`portfolio-photos-${actorId}`, () => portfolioApi.photos(actorId).then(oldestFirst))

export const useShowreels = (actorId: string) =>
  useApiQuery(`portfolio-showreels-${actorId}`, () => portfolioApi.showreels(actorId).then(oldestFirst))