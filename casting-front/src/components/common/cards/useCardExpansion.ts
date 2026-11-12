import { useRef, useState, type FocusEvent, type PointerEvent } from 'react'

export function useCardExpansion(disabled = false) {
  const pointer = useRef<string | null>(null)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [opened, setOpened] = useState(false)
  const expanded = !disabled && (hovered || focused)

  const cardProps = {
    tabIndex: 0,
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      pointer.current = event.pointerType
    },
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType !== 'mouse' || disabled) return
      setHovered(true)
      setOpened(true)
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'mouse') setHovered(false)
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      if (!event.target.matches(':focus-visible') && pointer.current !== 'touch') return
      setFocused(true)
      setOpened(true)
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (event.currentTarget.contains(event.relatedTarget)) return
      pointer.current = null
      setFocused(false)
    },
  }

  return { expanded, opened, cardProps }
}