import { HugeiconsIcon } from '@hugeicons/react'
import { Link, useMatch } from 'react-router'
import { SignOutButton } from '@/components/auth/SignOutButton'
import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'
import { showProfileRequired } from '@/components/profile/profile-required'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
  SidebarMenuBadge
} from '@/components/ui/sidebar'
import { rolePath } from '@/lib/routes'
import type { DashboardNavItem } from './dashboard-nav'
import { SettingsMenu } from './SettingsMenu'
import { SidebarProfile } from './SidebarProfile'
import { unreadLabel } from '@/components/chat/chat-format'
import { useUnreadTotal } from '@/components/chat/useUnreadTotal'

type Props = {
  items: DashboardNavItem[]
}

export function DashboardSidebar({ items }: Props) {
  const participant = useCurrentParticipant()
  if (!participant) return null

  const locked = !participant.profileComplete

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarProfile participant={participant} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) =>
              locked ? (
                <LockedNavItem key={item.page} item={item} />
              ) : (
                <NavLink key={item.page} to={rolePath(participant.role, item.page)} item={item} />
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Preferences</SidebarGroupLabel>
          <SettingsMenu role={participant.role} />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SignOut />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function NavLink({ to, item: { label, icon, showsUnread } }: { to: string; item: DashboardNavItem }) {
  const active = useMatch({ path: to, end: false }) !== null

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={active} tooltip={label} render={<Link to={to} />}>
        <HugeiconsIcon icon={icon} strokeWidth={2} />
        <span>{label}</span>
      </SidebarMenuButton>
      {showsUnread && <UnreadBadge />}
    </SidebarMenuItem>
  )
}

function UnreadBadge() {
  const count = useUnreadTotal()
  if (count === 0) return null

  return (
    <>
      <SidebarMenuBadge className="rounded-full bg-primary text-primary-foreground peer-hover/menu-button:text-primary-foreground peer-data-active/menu-button:text-primary-foreground">
        {unreadLabel(count)}
        <span className="sr-only"> unread messages</span>
      </SidebarMenuBadge>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1 right-1 hidden size-2 rounded-full bg-primary group-data-[collapsible=icon]:block"
      />
    </>
  )
}

function LockedNavItem({ item: { label, icon } }: { item: DashboardNavItem }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        aria-disabled
        tooltip={label}
        onClick={showProfileRequired}
        className="aria-disabled:pointer-events-auto aria-disabled:cursor-not-allowed"
      >
        <HugeiconsIcon icon={icon} strokeWidth={2} />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SignOut() {
  const { state, isMobile } = useSidebar()

  return <SignOutButton compact={state === 'collapsed' && !isMobile} />
}