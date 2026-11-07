import { useState, type KeyboardEvent } from 'react'
import { Add01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Badge } from '@/components/ui/badge'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'

type Props = {
  label: string
  value: readonly string[]
  onChange: (value: string[]) => void
  max: number
  maxLength: number
  placeholder?: string
}

export function TagInput({ label, value, onChange, max, maxLength, placeholder }: Props) {
  const [draft, setDraft] = useState('')
  const [problem, setProblem] = useState<string | null>(null)
  const full = value.length >= max

  const add = () => {
    const tag = draft.trim().replace(/\s+/g, ' ')
    if (!tag) return
    if (value.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
      setProblem(`"${tag}" is already on the list`)
      return
    }
    onChange([...value, tag])
    setDraft('')
    setProblem(null)
  }

  const remove = (tag: string) => onChange(value.filter((existing) => existing !== tag))

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      add()
    } else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      remove(value[value.length - 1])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <ul aria-label={label} className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <li key={tag}>
              <Badge variant="secondary" className="h-6 gap-1 pr-1">
                {tag}
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={() => remove(tag)}
                  className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
      <InputGroup>
        <InputGroupInput
          aria-label={`New ${label.toLowerCase()}`}
          value={draft}
          maxLength={maxLength}
          disabled={full}
          placeholder={full ? `You have all ${max}` : placeholder}
          onChange={(event) => {
            setDraft(event.target.value)
            setProblem(null)
          }}
          onKeyDown={handleKeyDown}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" variant="ghost" aria-label="Add" disabled={full || !draft.trim()} onClick={add}>
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {problem && <p className="text-xs text-destructive">{problem}</p>}
    </div>
  )
}