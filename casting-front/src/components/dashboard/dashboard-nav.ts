import {
  Agreement01Icon,
  BubbleChatIcon,
  DocumentValidationIcon,
  Film01Icon,
  MaskTheater01Icon,
  PaintBoardIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserSquareIcon,
  SecurityLockIcon,
} from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'

export type DashboardNavItem = {
  page: string
  label: string
  icon: IconSvgElement
  showsUnread?: boolean
}

export const actorNav: DashboardNavItem[] = [
  { page: 'portfolio', label: 'Portfolio', icon: UserSquareIcon },
  { page: 'roles', label: 'Roles', icon: MaskTheater01Icon },
  { page: 'chat', label: 'Chat', icon: BubbleChatIcon, showsUnread: true },
]

export const directorNav: DashboardNavItem[] = [
  { page: 'films', label: 'Films', icon: Film01Icon },
  { page: 'crew', label: 'Crew', icon: UserGroupIcon },
  { page: 'applications', label: 'Applications', icon: DocumentValidationIcon },
  { page: 'chat', label: 'Chat', icon: BubbleChatIcon, showsUnread: true },
]

export const castingDirectorNav: DashboardNavItem[] = [
  { page: 'crew', label: 'Crew', icon: UserGroupIcon },
  { page: 'roles', label: 'Roles', icon: MaskTheater01Icon },
  { page: 'proposals', label: 'Proposals', icon: Agreement01Icon },
]

export const settingsNav: DashboardNavItem[] = [
  { page: 'settings/account', label: 'Account', icon: UserCircleIcon },
  { page: 'settings/theme', label: 'Theme', icon: PaintBoardIcon },
  { page: 'settings/privacy', label: 'Privacy', icon: SecurityLockIcon },
]