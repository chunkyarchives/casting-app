import { ArrowRight01Icon, ChartBarLineIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, useMatch } from 'react-router'
import { SignOutButton } from '@/components/auth/SignOutButton'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { paths } from '@/lib/routes'
import { statisticsSectionIds, statisticsSectionTitles } from './statistics/sections'

export function AdminSidebar() {
  const onStatistics = useMatch(paths.adminStatistics) !== null

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="py-2 text-center text-lg font-semibold">Control</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <Collapsible defaultOpen render={<SidebarMenuItem />}>
              <SidebarMenuButton isActive={onStatistics} render={<Link to={paths.adminStatistics} />}>
                <HugeiconsIcon icon={ChartBarLineIcon} strokeWidth={2} />
                <span>Statistics</span>
              </SidebarMenuButton>

              <CollapsibleTrigger
                render={<SidebarMenuAction className="transition-transform aria-expanded:rotate-90" />}
              >
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
                <span className="sr-only">Show or hide statistics sections</span>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <SidebarMenuSub>
                  {statisticsSectionIds.map((id) => (
                    <SidebarMenuSubItem key={id}>
                      <SidebarMenuSubButton
                        render={<Link to={{ pathname: paths.adminStatistics, hash: id }} />}
                      >
                        <span>{statisticsSectionTitles[id]}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SignOutButton />
      </SidebarFooter>
    </Sidebar>
  )
}