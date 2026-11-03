const storageKey = 'admin-audit-cleared-at'

export function readClearedAt() {
  try {
    return localStorage.getItem(storageKey)
  } catch {
    return null
  }
}

export function saveClearedAt(value: string | null) {
  try {
    if (value) localStorage.setItem(storageKey, value)
    else localStorage.removeItem(storageKey)
  } catch {}
}