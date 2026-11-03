import { Fragment } from 'react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { Option } from '@/components/common/list/CheckboxGroup'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type OptionGroup<T extends string> = {
  label: string
  options: Option<T>[]
}

type Props<T extends string> = {
  label: string
  groups: OptionGroup<T>[]
  checked: T[]
  onCheckedChange: (checked: T[]) => void
}

export function FilterMenu<T extends string>({ label, groups, checked, onCheckedChange }: Props<T>) {
  const values = groups.flatMap((group) => group.options.map((option) => option.value))

  const toggle = (value: T, on: boolean) =>
    onCheckedChange(values.filter((v) => (v === value ? on : checked.includes(v))))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {label}
        {checked.length > 0 && <Badge variant="secondary">{checked.length}</Badge>}
        <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} data-icon="inline-end" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        {groups.map((group, index) => (
          <Fragment key={group.label}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
              {group.options.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={checked.includes(option.value)}
                  onCheckedChange={(on) => toggle(option.value, on)}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}