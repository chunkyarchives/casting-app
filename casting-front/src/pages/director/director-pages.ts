import { preloadPages } from '@/lib/preload'
import { dashboardPages } from '@/pages/dashboard/dashboard-pages'

export const directorPages = {
  films: () => import('./Films'),
  crew: () => import('./Crew'),
  applications: () => import('./Applications'),
}

export const preloadDirectorPages = () => preloadPages(directorPages, dashboardPages)