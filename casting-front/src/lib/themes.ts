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

const classic: SiteTheme = {
  id: 'classic',
  name: 'Classic',
  description: 'The classic Actdition theme: white panels with black lines on a light gray background.',
  className: 'classic',
}

const performative: SiteTheme = {
  id: 'performative',
  name: 'Performative',
  description: 'The slate blue night of Letterboxd, with its green for actions and orange for highlights.',
  className: 'dark performative',
}

const rennt: SiteTheme = {
  id: 'rennt',
  name: 'Rennt',
  description: "Lola's reds, sage green and dusty Berlin browns. Videogamey, retro, running for your life vibes.",
  className: 'dark rennt',
}

const wizz: SiteTheme = {
  id: 'wizz',
  name: 'Wizz',
  description: 'Wizz Air purple and magenta on a light page. One small bag included.',
  className: 'wizz',
}

export const siteThemes = [newDarkCinema, defaultDark, classic, performative, rennt, wizz].sort((a, b) =>
  a.name.localeCompare(b.name),
)

export const defaultSiteTheme = newDarkCinema

export const findSiteTheme = (id: string | null) => siteThemes.find((theme) => theme.id === id) ?? defaultSiteTheme

export const themes = {
  admin: 'admin-light',
  grayscale: 'default-grayscale',
} as const