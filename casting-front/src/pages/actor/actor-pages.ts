import { preloadPages } from '@/lib/preload'
import { dashboardPages } from '@/pages/dashboard/dashboard-pages'

export const actorPages = {
  portfolio: () => import('./Portfolio'),
  roles: () => import('./Roles'),
}

export const preloadActorPages = () => preloadPages(actorPages, dashboardPages)