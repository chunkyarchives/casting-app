import { useId } from 'react'
import { Calendar03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatDate } from '@/lib/format'

export type LockUntil =
  | { kind: 'untilUnlocked' }
  | { kind: 'until'; date: Date | undefined; time: string }

export const defaultLockUntil: LockUntil = { kind: 'untilUnlocked' }

export function lockEnd(lockUntil: LockUntil): Date | undefined {
  if (lockUntil.kind === 'untilUnlocked' || !lockUntil.date) return undefined

  const [hours, minutes] = lockUntil.time.split(':').map(Number)
  const end = new Date(lockUntil.date)
  end.setHours(hours, minutes, 0, 0)
  return end
}

type Props = {
  value: LockUntil
  onChange: (value: LockUntil) => void
}

export function LockUntilField({ value, onChange }: Props) {
  const id = useId()
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  return (
    <FieldSet className="gap-3">
      <FieldLegend variant="label">Lock until</FieldLegend>

      <RadioGroup
        value={value.kind}
        onValueChange={(kind) =>
          onChange(kind === 'until' ? { kind: 'until', date: undefined, time: '23:59' } : defaultLockUntil)
        }
      >
        <Field orientation="horizontal" className="gap-2">
          <RadioGroupItem id={`${id}-unlocked`} value="untilUnlocked" />
          <FieldLabel htmlFor={`${id}-unlocked`} className="font-normal">
            Until I unlock it
          </FieldLabel>
        </Field>
        <Field orientation="horizontal" className="gap-2">
          <RadioGroupItem id={`${id}-until`} value="until" />
          <FieldLabel htmlFor={`${id}-until`} className="font-normal">
            Until a date and time
          </FieldLabel>
        </Field>
      </RadioGroup>

      {value.kind === 'until' && (
        <div className="flex gap-2 pl-6">
          <Popover>
            <PopoverTrigger
              render={<Button variant="outline" className="flex-1 justify-start font-normal" />}
            >
              <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
              {value.date ? formatDate(value.date) : 'Pick a day'}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value.date}
                onSelect={(date) => onChange({ ...value, date })}
                disabled={{ before: startOfToday }}
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            value={value.time}
            onChange={(event) => onChange({ ...value, time: event.target.value })}
            aria-label="Time"
            className="w-32"
          />
        </div>
      )}
    </FieldSet>
  )
}