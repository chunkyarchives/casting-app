import { ChartBarLineIcon, Film01Icon, UserMultiple02Icon, CommandLineIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
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
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { paths } from '@/lib/routes'

type NavItem = {
  path: string
  label: string
  icon: IconSvgElement
}

const navItems: NavItem[] = [
  { path: paths.adminStatistics, label: 'Statistics', icon: ChartBarLineIcon },
  { path: paths.adminAccounts, label: 'Accounts', icon: UserMultiple02Icon },
  { path: paths.adminProductions, label: 'Productions', icon: Film01Icon },
  { path: paths.adminAuditLogs, label: 'Audit logs', icon: CommandLineIcon }
]

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="py-2 text-center text-lg font-semibold">Control</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  )
}

function NavLink({ item: { path, label, icon } }: { item: NavItem }) {
  const active = useMatch(path) !== null

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={active} render={<Link to={path} />}>
        <HugeiconsIcon icon={icon} strokeWidth={2} />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}