import flagIconsCountries from 'flag-icons/country.json'

export type Country = { code: string; name: string }

export const countries: Country[] = flagIconsCountries
  .filter((country) => country.iso)
  .map((country) => ({ code: country.code.toUpperCase(), name: country.name }))
  .sort((a, b) => a.name.localeCompare(b.name))

const namesByCode = new Map(countries.map((country) => [country.code, country.name]))

export const countryName = (code: string) => namesByCode.get(code.toUpperCase()) ?? code