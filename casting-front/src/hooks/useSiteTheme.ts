import { useSyncExternalStore } from 'react'
import { useCurrentParticipant } from '@/components/auth/hooks/useCurrentParticipant'
import { readThemePreference, subscribeToThemePreferences, writeThemePreference } from '@/lib/theme-preference'
import { findSiteTheme, type SiteTheme } from '@/lib/themes'

export function useSiteTheme() {
  const participantId = useCurrentParticipant()?.id ?? null

  const themeId = useSyncExternalStore(subscribeToThemePreferences, () =>
    participantId ? readThemePreference(participantId) : null,
  )

  const setTheme = (theme: SiteTheme) => {
    if (participantId) writeThemePreference(participantId, theme.id)
  }

  return [findSiteTheme(themeId), setTheme] as const
}