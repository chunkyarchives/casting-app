import { BubbleChatIcon, MaskTheater01Icon, PaintBoardIcon, UserCircleIcon, UserSquareIcon } from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'

export type DashboardNavItem = {
  page: string
  label: string
  icon: IconSvgElement
}

export const actorNav: DashboardNavItem[] = [
  { page: 'portfolio', label: 'Portfolio', icon: UserSquareIcon },
  { page: 'roles', label: 'Roles', icon: MaskTheater01Icon },
  { page: 'chat', label: 'Chat', icon: BubbleChatIcon },
]

// Every role has the same settings, in the Settings submenu
export const settingsNav: DashboardNavItem[] = [
  { page: 'settings/account', label: 'Account', icon: UserCircleIcon },
  { page: 'settings/theme', label: 'Theme', icon: PaintBoardIcon },
]