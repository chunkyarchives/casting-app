import { Outlet } from 'react-router'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useRootTheme } from '@/hooks/useRootTheme'

const adminTheme = 'admin-light'

export default function AdminLayout() {
  useRootTheme(adminTheme)

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center px-4 md:hidden">
          <SidebarTrigger />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}