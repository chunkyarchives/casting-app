export const themes = {
  site: 'dark new-dark-cinema',
  admin: 'admin-light',
  grayscale: 'default-grayscale',
} as const

export type Theme = (typeof themes)[keyof typeof themes]