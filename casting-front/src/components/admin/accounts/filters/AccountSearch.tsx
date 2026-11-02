import { useEffect, useEffectEvent, useState } from 'react'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

const searchDelayMs = 300

type Props = {
  value: string
  onChange: (value: string) => void
}

export function AccountSearch({ value, onChange }: Props) {
  const [text, setText] = useState(value)
  const [syncedValue, setSyncedValue] = useState(value)

  if (value !== syncedValue) {
    setSyncedValue(value)
    if (value !== text.trim()) setText(value)
  }

  const commit = useEffectEvent((next: string) => {
    if (next !== value) onChange(next)
  })

  useEffect(() => {
    const timer = setTimeout(() => commit(text.trim()), searchDelayMs)
    return () => clearTimeout(timer)
  }, [text])

  return (
    <InputGroup className="mx-auto w-full max-w-md"> 
      <InputGroupInput
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Search by name or e-mail"
        aria-label="Search accounts"
      />
      <InputGroupAddon>
        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
      </InputGroupAddon>
    </InputGroup>
  )
}