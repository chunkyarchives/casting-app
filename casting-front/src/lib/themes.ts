export type SiteTheme = {
  id: string
  name: string
  description: string
  className: string
}

const newDarkCinema: SiteTheme = {
  id: 'new-dark-cinema',
  name: 'New Dark Cinema',
  description: 'Warm dark grays with a deep red accent, like a theater just before the lights go down.',
  className: 'dark new-dark-cinema',
}

const defaultDark: SiteTheme = {
  id: 'default',
  name: 'Default',
  description: 'The original dark theme: deeper blacks, neutral highlights and the same red accent.',
  className: 'dark',
}

export const siteThemes = [newDarkCinema, defaultDark]

export const defaultSiteTheme = newDarkCinema

export const findSiteTheme = (id: string | null) => siteThemes.find((theme) => theme.id === id) ?? defaultSiteTheme

export const themes = {
  admin: 'admin-light',
  grayscale: 'default-grayscale',
} as const