import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Calendar03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type Props = {
  label: string
  value: string | null
  onChange: (value: string) => void
  min: string
  max: string
  defaultMonth?: Date
  placeholder?: string
  invalid?: boolean
  align?: 'start' | 'center'
}

export function DatePicker({ label, value, onChange, min, max, defaultMonth, placeholder = 'Pick a date', invalid = false, align = 'start' }: Props) {
  const [open, setOpen] = useState(false)
  const selected = value ? parseISO(value) : undefined
  const first = parseISO(min)
  const last = parseISO(max)

  const select = (date: Date | undefined) => {
    if (!date) return
    onChange(format(date, 'yyyy-MM-dd'))
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            aria-label={label}
            aria-invalid={invalid}
            className={cn('w-full font-normal', align === 'center' ? 'justify-center' : 'justify-start')}
          />
        }
      >
        <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} data-icon="inline-start" />
        {selected ? format(selected, 'd MMMM yyyy') : <span className="text-muted-foreground">{placeholder}</span>}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={select}
          captionLayout="dropdown"
          defaultMonth={selected ?? defaultMonth ?? last}
          startMonth={first}
          endMonth={last}
          disabled={[{ before: first }, { after: last }]}
        />
      </PopoverContent>
    </Popover>
  )
}