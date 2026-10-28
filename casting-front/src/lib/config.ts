const apiUrl = import.meta.env.castingApiUrl

if (!apiUrl) {
  throw new Error('castingApiUrl is not set. Copy casting-front/.env.example to .env.')
}

export const apiBaseUrl = apiUrl 