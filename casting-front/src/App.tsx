import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { RequireRole } from '@/components/auth/RequireRole'
import PublicLayout from '@/layouts/PublicLayout'
import { paths, roleSettingsPath } from '@/lib/routes'
import Landing from '@/pages/Landing'

const ActorDashboard = lazy(() => import('@/pages/actor/ActorDashboard'))
const DirectorDashboard = lazy(() => import('@/pages/director/DirectorDashboard'))
const CastingDirectorDashboard = lazy(() => import('@/pages/casting-director/CastingDirectorDashboard'))
const Settings = lazy(() => import('@/pages/settings/Settings'))

const AdminLayout = lazy(() => import('@/layouts/AdminLayout'))
const Statistics = lazy(() => import('@/pages/admin/Statistics'))
const Accounts = lazy(() => import('@/pages/admin/Accounts'))
const Productions = lazy(() => import('@/pages/admin/Productions'))
const AuditLogs = lazy(() => import('@/pages/admin/AuditLogs'))

export default function App() {
  return (
    <Suspense>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
        </Route>

        <Route element={<RequireRole role="Actor" />}>
          <Route path={paths.actor} element={<ActorDashboard />} />
          <Route path={roleSettingsPath('Actor')} element={<Settings />} />
        </Route>
        <Route element={<RequireRole role="Director" />}>
          <Route path={paths.director} element={<DirectorDashboard />} />
          <Route path={roleSettingsPath('Director')} element={<Settings />} />
        </Route>
        <Route element={<RequireRole role="CastingDirector" />}>
          <Route path={paths.castingDirector} element={<CastingDirectorDashboard />} />
          <Route path={roleSettingsPath('CastingDirector')} element={<Settings />} />
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