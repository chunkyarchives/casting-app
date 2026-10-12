import { Outlet } from 'react-router'
import { AuthDrawerProvider } from '@/components/auth/drawer/AuthDrawerProvider'
import { Navbar } from '@/components/layout/Navbar'

export default function PublicLayout() {
  return (
    <AuthDrawerProvider>
      <div className="flex min-h-svh flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
      </div>
    </AuthDrawerProvider>
  )
}