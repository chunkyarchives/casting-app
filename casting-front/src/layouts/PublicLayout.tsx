import { Suspense, useEffect } from 'react'
import { Outlet } from 'react-router'
import { AuthDrawerProvider } from '@/components/auth/drawer/AuthDrawerProvider'
import { PageLoader } from '@/components/common/states/PageLoader'
import { Navbar } from '@/components/layout/Navbar'
import { prefetchPublicLists } from '@/components/public/public-lists'
import { preloadPublicPages } from '@/pages/public/public-pages'

export default function PublicLayout() {
  useEffect(() => {
    preloadPublicPages()
    prefetchPublicLists()
  }, [])

  return (
    <AuthDrawerProvider>
      <div className="flex min-h-svh flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </AuthDrawerProvider>
  )
}