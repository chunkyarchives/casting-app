// for more see envPrefix in vite.config.ts
declare global {
  interface ImportMetaEnv {
    readonly castingApiUrl?: string
  }
}

export {}