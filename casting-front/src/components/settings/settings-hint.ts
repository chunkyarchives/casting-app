import { createContext } from 'react'

export const SettingsHintContext = createContext<(hint: string | null) => void>(() => {})