import { useEffect, useEffectEvent, useState } from 'react'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

// const searchDelayMs = 0;

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
}

export function SearchField({ value, onChange, placeholder, label }: Props) {
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
    const timer = setTimeout(() => commit(text.trim()), 0)
    return () => clearTimeout(timer)
  }, [text])

  return (
    <InputGroup className="mx-auto w-full max-w-md">
      <InputGroupInput
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
      <InputGroupAddon>
        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />
      </InputGroupAddon>
    </InputGroup>
  )
}