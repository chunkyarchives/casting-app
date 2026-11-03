import { Outlet } from 'react-router'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useRootTheme } from '@/hooks/useRootTheme'
import { Toaster } from '@/components/ui/toast'
import { useEffect } from 'react'
import { prefetchAdminLists } from '@/components/admin/prefetch-lists'

const adminTheme = 'admin-light'

export default function AdminLayout() {
  useRootTheme(adminTheme)
  useEffect(() => prefetchAdminLists(), [])
  
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center px-4 md:hidden">
          <SidebarTrigger />
        </header>
        <Outlet />
      </SidebarInset>
      <Toaster/>
    </SidebarProvider>
  )
}