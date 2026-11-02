import { ChartBarLineIcon, UserMultiple02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, useMatch } from 'react-router'
import { SignOutButton } from '@/components/auth/SignOutButton'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { paths } from '@/lib/routes'

export function AdminSidebar() {
  const onStatistics = useMatch(paths.adminStatistics) !== null
  const onAccounts = useMatch(paths.adminAccounts) !== null

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="py-2 text-center text-lg font-semibold">Control</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={onStatistics} render={<Link to={paths.adminStatistics} />}>
                <HugeiconsIcon icon={ChartBarLineIcon} strokeWidth={2} />
                <span>Statistics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={onAccounts} render={<Link to={paths.adminAccounts} />}>
                <HugeiconsIcon icon={UserMultiple02Icon} strokeWidth={2} />
                <span>Accounts</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  )
}