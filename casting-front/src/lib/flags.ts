const flagUrls = import.meta.glob<string>('/node_modules/flag-icons/flags/4x3/*.svg', {
  eager: true,
  query: '?no-inline',
  import: 'default',
})

export const unknownFlagUrl = flagUrls['/node_modules/flag-icons/flags/4x3/xx.svg']

export const flagUrl = (code: string): string | undefined =>
  flagUrls[`/node_modules/flag-icons/flags/4x3/${code.toLowerCase()}.svg`]

let warmed = false

export function warmFlagCache() {
  if (warmed) return
  warmed = true

  const load = () => {
    for (const url of Object.values(flagUrls)) {
      const image = new Image()
      image.decoding = 'async'
      image.src = url
    }
  }

  if ('requestIdleCallback' in window) requestIdleCallback(load)
  else setTimeout(load, 300)
}