import { useState } from 'react'
import { ArrowDown01Icon, Settings02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, useMatch } from 'react-router'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { rolePath, roleSettingsPath } from '@/lib/routes'
import type { ParticipantRole } from '@/types/participant'
import { settingsNav, type DashboardNavItem } from './dashboard-nav'

export function SettingsMenu({ role }: { role: ParticipantRole }) {
  const { state, isMobile, setOpen } = useSidebar()
  const narrow = state === 'collapsed' && !isMobile
  const inSettings = useMatch({ path: roleSettingsPath(role), end: false }) !== null

  const [expanded, setExpanded] = useState(inSettings)
  const [wasInSettings, setWasInSettings] = useState(inSettings)
  if (inSettings !== wasInSettings) {
    setWasInSettings(inSettings)
    if (inSettings) setExpanded(true)
  }

  const handleOpenChange = (open: boolean) => {
    if (narrow) {
      setOpen(true)
      setExpanded(true)
    } else {
      setExpanded(open)
    }
  }

  return (
    <SidebarMenu>
      <Collapsible
        open={expanded}
        onOpenChange={handleOpenChange}
        className="group/collapsible"
        render={<SidebarMenuItem />}
      >
        <CollapsibleTrigger render={<SidebarMenuButton tooltip="Settings" isActive={inSettings && narrow} />}>
          <HugeiconsIcon icon={Settings02Icon} strokeWidth={2} />
          <span>Settings</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={2}
            className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-180"
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {settingsNav.map((item) => (
              <SettingsLink key={item.page} to={rolePath(role, item.page)} item={item} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenu>
  )
}

function SettingsLink({ to, item: { label, icon } }: { to: string; item: DashboardNavItem }) {
  const active = useMatch(to) !== null

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton isActive={active} render={<Link to={to} />}>
        <HugeiconsIcon icon={icon} strokeWidth={2} />
        <span>{label}</span>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}