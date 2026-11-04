import { Outlet } from 'react-router'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useRootTheme } from '@/hooks/useRootTheme'
import { themes } from '@/lib/themes'
import { Toaster } from '@/components/ui/toast'
import { Suspense, useEffect } from 'react'
import { prefetchAdminLists } from '@/components/admin/prefetch-lists'
import { PageLoader } from '@/components/common/states/PageLoader'
import { preloadAdminPages } from '@/pages/admin/admin-pages'

export default function AdminLayout() {
  useRootTheme(themes.admin)
  useEffect(() => {
    prefetchAdminLists()
    preloadAdminPages()
  }, [])

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="min-w-0">
        <header className="flex h-12 items-center px-4 md:hidden">
          <SidebarTrigger />
        </header>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}