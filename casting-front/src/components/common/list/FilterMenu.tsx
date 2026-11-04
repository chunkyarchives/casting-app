import type { ReactNode } from 'react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export type Option<T extends string> = { value: T; label: string }

type MenuProps = {
  label: string
  activeCount: number
  children: ReactNode
}

export function FilterMenu({ label, activeCount, children }: MenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {label}
        {activeCount > 0 && <Badge variant="secondary">{activeCount}</Badge>}
        <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}

type GroupProps<T extends string> = {
  label: string
  options: Option<T>[]
  checked: readonly T[]
  onCheckedChange: (checked: T[]) => void
  disabled?: boolean
}

export function FilterMenuGroup<T extends string>({
  label,
  options,
  checked,
  onCheckedChange,
  disabled = false,
}: GroupProps<T>) {
  const toggle = (value: T, on: boolean) =>
    onCheckedChange(on ? [...checked, value] : checked.filter((v) => v !== value))

  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel className={cn(disabled && 'opacity-50')}>{label}</DropdownMenuLabel>
      {options.map((option) => (
        <DropdownMenuCheckboxItem
          key={option.value}
          checked={checked.includes(option.value)}
          disabled={disabled}
          onCheckedChange={(on) => toggle(option.value, on)}
        >
          {option.label}
        </DropdownMenuCheckboxItem>
      ))}
    </DropdownMenuGroup>
  )
}