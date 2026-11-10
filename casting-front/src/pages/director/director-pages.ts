import { preloadPages } from '@/lib/preload'
import { dashboardPages } from '@/pages/dashboard/dashboard-pages'

export const directorPages = {
  films: () => import('./Films'),
  film: () => import('./Film'),
  filmEditor: () => import('./FilmEditor'),
  roleEditor: () => import('./RoleEditor'),
  crew: () => import('./Crew'),
  applications: () => import('./Applications'),
}

export const preloadDirectorPages = () => preloadPages(directorPages, dashboardPages)