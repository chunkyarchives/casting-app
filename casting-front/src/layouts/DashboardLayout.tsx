import { Suspense, useEffect } from 'react'
import { Outlet } from 'react-router'
import { ApplicationNotifier } from '@/components/application/ApplicationNotifier'
import { ChatNotifier } from '@/components/chat/ChatNotifier'
import { PageLoader } from '@/components/common/states/PageLoader'
import { CrewNotifier } from '@/components/crew/CrewNotifier'
import type { DashboardNavItem } from '@/components/dashboard/dashboard-nav'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

type Props = {
  items: DashboardNavItem[]
  preload?: () => void
}

const sidebarWasOpen = () => !document.cookie.split('; ').includes('sidebar_state=false')

export default function DashboardLayout({ items, preload }: Props) {
  useEffect(() => preload?.(), [preload])

  return (
    <SidebarProvider defaultOpen={sidebarWasOpen()}>
      <DashboardSidebar items={items} />
      <SidebarInset className="min-w-0">
        <header className="flex h-12 items-center px-3">
          <SidebarTrigger />
        </header>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </SidebarInset>
      <ChatNotifier />
      <CrewNotifier />
      <ApplicationNotifier />
    </SidebarProvider>
  )
}