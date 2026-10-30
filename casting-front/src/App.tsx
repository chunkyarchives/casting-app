import { Navigate, Route, Routes } from 'react-router'
import { RequireRole } from '@/components/auth/RequireRole'
import PublicLayout from '@/layouts/PublicLayout'
import { paths, roleSettingsPath } from '@/lib/routes'
import ActorDashboard from '@/pages/actor/ActorDashboard'
import CastingDirectorDashboard from '@/pages/casting-director/CastingDirectorDashboard'
import DirectorDashboard from '@/pages/director/DirectorDashboard'
import Landing from '@/pages/Landing'
import Settings from '@/pages/settings/Settings'
import AdminLayout from '@/layouts/AdminLayout'
import Statistics from '@/pages/admin/Statistics'

export default function App() {
  return (
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
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={paths.landing} replace />} />
    </Routes>
  )
}