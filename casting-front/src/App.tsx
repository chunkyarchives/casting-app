import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { RequireCompleteProfile } from '@/components/auth/RequireCompleteProfile'
import { RequireRole } from '@/components/auth/RequireRole'
import { PageLoader } from '@/components/common/states/PageLoader'
import { actorNav, castingDirectorNav, directorNav } from '@/components/dashboard/dashboard-nav'
import PublicLayout from '@/layouts/PublicLayout'
import ThemeLayout from '@/layouts/ThemeLayout'
import { paths } from '@/lib/routes'
import Landing from '@/pages/Landing'
import { actorPages, preloadActorPages } from '@/pages/actor/actor-pages'
import { adminPages } from '@/pages/admin/admin-pages'
import { castingDirectorPages, preloadCastingDirectorPages } from '@/pages/casting-director/casting-director-pages'
import { dashboardPages } from '@/pages/dashboard/dashboard-pages'
import { directorPages, preloadDirectorPages } from '@/pages/director/director-pages'
import { publicPages } from '@/pages/public/public-pages'

const Movies = lazy(publicPages.movies)
const PopularRoles = lazy(publicPages.roles)
const Network = lazy(publicPages.network)
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'))
const Statistics = lazy(adminPages.statistics)
const Accounts = lazy(adminPages.accounts)
const Productions = lazy(adminPages.productions)
const AuditLogs = lazy(adminPages.auditLogs)

const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'))
const Welcome = lazy(dashboardPages.welcome)
const Chat = lazy(dashboardPages.chat)
const AccountSettings = lazy(dashboardPages.accountSettings)
const ThemeSettings = lazy(dashboardPages.themeSettings)
const PrivacySettings = lazy(dashboardPages.privacySettings)

const ActorPortfolio = lazy(actorPages.portfolio)
const ActorRoles = lazy(actorPages.roles)

const DirectorFilms = lazy(directorPages.films)
const DirectorFilm = lazy(directorPages.film)
const DirectorFilmEditor = lazy(directorPages.filmEditor)
const DirectorRoleEditor = lazy(directorPages.roleEditor)
const DirectorCrew = lazy(directorPages.crew)
const DirectorApplications = lazy(directorPages.applications)

const CastingDirectorCrew = lazy(castingDirectorPages.crew)
const CastingDirectorRoles = lazy(castingDirectorPages.roles)
const CastingDirectorProposals = lazy(castingDirectorPages.proposals)

export default function App() {
  return (
    <Suspense fallback={<PageLoader className="min-h-svh" />}>
      <Routes>
        <Route element={<ThemeLayout />}>
          <Route element={<PublicLayout />}>
            <Route index element={<Landing />} />
            <Route path={paths.movies} element={<Movies />} />
            <Route path={paths.roles} element={<PopularRoles />} />
            <Route path={paths.network} element={<Network />} />
          </Route>

          <Route element={<RequireRole role="Actor" />}>
            <Route path={paths.actor} element={<DashboardLayout items={actorNav} preload={preloadActorPages} />}>
              <Route index element={<Welcome role="Actor" />} />
              <Route element={<RequireCompleteProfile />}>
                <Route path="portfolio" element={<ActorPortfolio />} />
                <Route path="roles" element={<ActorRoles />} />
                <Route path="chat" element={<Chat />} />
              </Route>
              <Route path="settings">
                <Route index element={<Navigate to="account" replace />} />
                <Route path="account" element={<AccountSettings role="Actor" />} />
                <Route path="theme" element={<ThemeSettings />} />
                <Route path="privacy" element={<PrivacySettings />} />
              </Route>
            </Route>
          </Route>

          <Route element={<RequireRole role="Director" />}>
            <Route path={paths.director} element={<DashboardLayout items={directorNav} preload={preloadDirectorPages} />}>
              <Route index element={<Welcome role="Director" />} />
              <Route element={<RequireCompleteProfile />}>
                <Route path="films">
                  <Route index element={<DirectorFilms />} />
                  <Route path="new" element={<DirectorFilmEditor />} />
                  <Route path=":filmId" element={<DirectorFilm />} />
                  <Route path=":filmId/edit" element={<DirectorFilmEditor />} />
                  <Route path=":filmId/roles/new" element={<DirectorRoleEditor />} />
                  <Route path=":filmId/roles/:roleId/edit" element={<DirectorRoleEditor />} />
                </Route>
                <Route path="crew" element={<DirectorCrew />} />
                <Route path="applications" element={<DirectorApplications />} />
                <Route path="chat" element={<Chat />} />
              </Route>
              <Route path="settings">
                <Route index element={<Navigate to="account" replace />} />
                <Route path="account" element={<AccountSettings role="Director" />} />
                <Route path="theme" element={<ThemeSettings />} />
                <Route path="privacy" element={<PrivacySettings />} />
              </Route>
            </Route>
          </Route>

          <Route element={<RequireRole role="CastingDirector" />}>
            <Route
              path={paths.castingDirector}
              element={<DashboardLayout items={castingDirectorNav} preload={preloadCastingDirectorPages} />}
            >
              <Route index element={<Welcome role="CastingDirector" />} />
              <Route element={<RequireCompleteProfile />}>
                <Route path="crew" element={<CastingDirectorCrew />} />
                <Route path="matchmaking" element={<CastingDirectorRoles />} />
                <Route path="proposals" element={<CastingDirectorProposals />} />
              </Route>
              <Route path="settings">
                <Route index element={<Navigate to="account" replace />} />
                <Route path="account" element={<AccountSettings role="CastingDirector" />} />
                <Route path="theme" element={<ThemeSettings />} />
                <Route path="privacy" element={<PrivacySettings />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route element={<RequireRole role="Admin" />}>
          <Route path={paths.admin} element={<AdminLayout />}>
            <Route index element={<Navigate to={paths.adminStatistics} replace />} />
            <Route path={paths.adminStatistics} element={<Statistics />} />
            <Route path={paths.adminAccounts} element={<Accounts />} />
            <Route path={paths.adminProductions} element={<Productions />} />
            <Route path={paths.adminAuditLogs} element={<AuditLogs />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={paths.landing} replace />} />
      </Routes>
    </Suspense>
  )
}