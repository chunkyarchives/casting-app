import { Routes, Route } from 'react-router'
import PublicLayout from '@/layouts/PublicLayout'
import LandingPage from '@/pages/LandingPage'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
      </Route>
    </Routes>
  )
}