type PageLoaders = Record<string, () => Promise<unknown>>

export function preloadPages(...groups: PageLoaders[]) {
  groups.forEach((pages) => Object.values(pages).forEach((load) => load().catch(() => {})))
}