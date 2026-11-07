import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { RequireRole } from '@/components/auth/RequireRole'
import { PageLoader } from '@/components/common/states/PageLoader'
import PublicLayout from '@/layouts/PublicLayout'
import ThemeLayout from '@/layouts/ThemeLayout'
import { themes } from '@/lib/themes'
import { paths, roleSettingsPath } from '@/lib/routes'
import Landing from '@/pages/Landing'
import { adminPages } from '@/pages/admin/admin-pages'

import { RequireCompleteProfile } from '@/components/auth/RequireCompleteProfile'

import { actorNav } from '@/components/dashboard/dashboard-nav'
import { actorPages, preloadActorPages } from '@/pages/actor/actor-pages'
import { dashboardPages } from '@/pages/dashboard-pages'

const Welcome = lazy(dashboardPages.welcome)

const DirectorDashboard = lazy(() => import('@/pages/director/DirectorDashboard'))
const CastingDirectorDashboard = lazy(() => import('@/pages/casting-director/CastingDirectorDashboard'))
const Settings = lazy(() => import('@/pages/settings/Settings'))

const AdminLayout = lazy(() => import('@/layouts/AdminLayout'))
const Statistics = lazy(adminPages.statistics)
const Accounts = lazy(adminPages.accounts)
const Productions = lazy(adminPages.productions)
const AuditLogs = lazy(adminPages.auditLogs)

const DashboardLayout = lazy(() => import('@/layouts/DashboardLayout'))
const Chat = lazy(dashboardPages.chat)
const AccountSettings = lazy(dashboardPages.accountSettings)
const ThemeSettings = lazy(dashboardPages.themeSettings)
const ActorPortfolio = lazy(actorPages.portfolio)
const ActorRoles = lazy(actorPages.roles)

export default function App() {
  return (
    <Suspense fallback={<PageLoader className="min-h-svh" />}>
      <Routes>
        <Route element={<ThemeLayout />}>
          <Route element={<PublicLayout />}>
            <Route index element={<Landing />} />
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
                  <Route path="account" element={<AccountSettings />} />
                  <Route path="theme" element={<ThemeSettings />} />
              </Route>
            </Route>
          </Route>

          <Route element={<RequireRole role="Director" />}>
            <Route path={paths.director} element={<DirectorDashboard />} />
            <Route path={roleSettingsPath('Director')} element={<Settings />} />
          </Route>

          <Route element={<RequireRole role="CastingDirector" />}>
            <Route path={paths.castingDirector} element={<CastingDirectorDashboard />} />
            <Route path={roleSettingsPath('CastingDirector')} element={<Settings />} />
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