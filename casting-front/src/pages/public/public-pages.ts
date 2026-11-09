import { preloadPages } from '@/lib/preload'

export const publicPages = {
  movies: () => import('./Movies'),
  roles: () => import('./Roles'),
  network: () => import('./Network'),
}

export const preloadPublicPages = () => preloadPages(publicPages)