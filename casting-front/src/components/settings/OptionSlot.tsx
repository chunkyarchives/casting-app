import { useEffect, useEffectEvent, useState, type FocusEvent, type PointerEvent } from 'react'
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button } from '@/components/ui/button'

type Props<T> = {
  label: string
  options: readonly T[]
  value: T
  getLabel: (option: T) => string
  onChange: (option: T) => void
  onActiveChange?: (active: boolean) => void
}

export function OptionSlot<T>({ label, options, value, getLabel, onChange, onActiveChange }: Props<T>) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const active = hovered || focused
  const valueLabel = getLabel(value)

  const setActive = (nextHovered: boolean, nextFocused: boolean) => {
    setHovered(nextHovered)
    setFocused(nextFocused)
    onActiveChange?.(nextHovered || nextFocused)
  }

  const step = (by: number) => {
    const index = options.indexOf(value)
    onChange(options[(index + by + options.length) % options.length])
  }

  const handleArrowKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return

    event.preventDefault()
    step(event.key === 'ArrowLeft' ? -1 : 1)
  })

  useEffect(() => {
    if (!active) return
    window.addEventListener('keydown', handleArrowKey)
    return () => window.removeEventListener('keydown', handleArrowKey)
  }, [active])

  const handlePointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') setActive(false, focused)
  }

  const handleFocus = (event: FocusEvent) => {
    if (event.target.matches(':focus-visible')) setActive(hovered, true)
  }

  const handleBlur = (event: FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setActive(hovered, false)
  }

  return (
    <div
      role="group"
      aria-label={label}
      data-active={active || undefined}
      onPointerEnter={() => setActive(true, focused)}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className="group/slot grid h-11 grid-cols-2 items-center border-l-2 border-transparent px-4 text-sm font-medium text-muted-foreground transition-colors data-active:border-primary data-active:bg-linear-to-r data-active:from-accent data-active:to-accent/40 data-active:text-foreground"
    >
      <span className="truncate">{label}</span>

      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Previous ${label.toLowerCase()}`}
          onClick={() => step(-1)}
          className="opacity-0 group-data-active/slot:opacity-100 pointer-coarse:opacity-100"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        </Button>
        <span key={valueLabel} aria-live="polite" className="flex-1 truncate text-center animate-in duration-200 fade-in-0">
          {valueLabel}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Next ${label.toLowerCase()}`}
          onClick={() => step(1)}
          className="opacity-0 group-data-active/slot:opacity-100 pointer-coarse:opacity-100"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  )
}