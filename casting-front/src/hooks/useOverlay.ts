import { useState } from 'react'

type OverlayState<T> = { open: boolean; value: T | null }

export function useOverlay<T>() {
  const [state, setState] = useState<OverlayState<T>>({ open: false, value: null })

  const show = (value: T) => setState({ open: true, value })
  const setOpen = (open: boolean) => setState((current) => ({ ...current, open }))

  return { open: state.open, value: state.value, show, setOpen }
}