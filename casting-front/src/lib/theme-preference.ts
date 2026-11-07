const preferenceKey = (participantId: string) => `casting-app.theme.${participantId}`

const bootThemeKey = 'casting-app.theme'

const listeners = new Set<() => void>()

export function readThemePreference(participantId: string) {
  try {
    return localStorage.getItem(preferenceKey(participantId))
  } catch {
    return null
  }
}

export function writeThemePreference(participantId: string, themeId: string) {
  try {
    localStorage.setItem(preferenceKey(participantId), themeId)
  } catch {}
  listeners.forEach((listener) => listener())
}

export function rememberBootTheme(className: string) {
  try {
    localStorage.setItem(bootThemeKey, className)
  } catch {}
}

export function subscribeToThemePreferences(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)

  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}