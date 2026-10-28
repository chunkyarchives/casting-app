import { Navigate, Route, Routes } from 'react-router'
import { RequireRole } from '@/components/auth/RequireRole'
import PublicLayout from '@/layouts/PublicLayout'
import { paths, roleSettingsPath } from '@/lib/routes'
import ActorDashboard from '@/pages/actor/ActorDashboard'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import CastingDirectorDashboard from '@/pages/casting-director/CastingDirectorDashboard'
import DirectorDashboard from '@/pages/director/DirectorDashboard'
import LandingPage from '@/pages/LandingPage'
import Settings from '@/pages/settings/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
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
        <Route path={paths.admin} element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to={paths.landing} replace />} />
    </Routes>
  )
}