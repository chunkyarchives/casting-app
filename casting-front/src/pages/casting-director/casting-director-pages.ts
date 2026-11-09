import { preloadPages } from '@/lib/preload'
import { dashboardPages } from '@/pages/dashboard/dashboard-pages'

export const castingDirectorPages = {
  crew: () => import('./Crew'),
  roles: () => import('./Roles'),
  proposals: () => import('./Proposals'),
}

export const preloadCastingDirectorPages = () => preloadPages(castingDirectorPages, dashboardPages)