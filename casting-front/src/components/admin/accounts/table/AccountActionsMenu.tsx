import {
  ArrowDown01Icon,
  Delete02Icon,
  Logout01Icon,
  SquareLock02Icon,
  SquareUnlock02Icon,
  ViewIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AdminAccount } from '@/types/admin'
import { fullName, type AccountAction } from '@/components/admin/accounts/account-actions'

type Props = {
  account: AdminAccount
  onSelect: (action: AccountAction) => void
}

export function AccountActionsMenu({ account, onSelect }: Props) {
  const manageable = account.role !== 'Admin'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${fullName(account)}`} />}
      >
        <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => onSelect('details')}>
          <HugeiconsIcon icon={ViewIcon} strokeWidth={2} />
          View details
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled={!manageable} onClick={() => onSelect('forceLogout')}>
          <HugeiconsIcon icon={Logout01Icon} strokeWidth={2} />
          Force logout
        </DropdownMenuItem>
        {account.locked ? (
          <DropdownMenuItem disabled={!manageable} onClick={() => onSelect('unlock')}>
            <HugeiconsIcon icon={SquareUnlock02Icon} strokeWidth={2} />
            Unlock
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled={!manageable} onClick={() => onSelect('lock')}>
            <HugeiconsIcon icon={SquareLock02Icon} strokeWidth={2} />
            Lock
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" disabled={!manageable} onClick={() => onSelect('delete')}>
          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
          Delete account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}