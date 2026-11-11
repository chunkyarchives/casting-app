import { countryName, isCountryCode } from '@/lib/countries'
import type { FilmRole } from '@/types/film'

export type RoleFact = {
  label: string
  value: string
  countryCode?: string
}

function range(label: string, min: number | null, max: number | null, unit: string): RoleFact | null {
  if (min !== null && max !== null) return { label, value: `${min === max ? min : `${min}–${max}`} ${unit}` }
  if (min !== null) return { label, value: `${min}+ ${unit}` }
  if (max !== null) return { label, value: `up to ${max} ${unit}` }
  return null
}

function origin(code: string | null): RoleFact | null {
  if (!code) return null
  return isCountryCode(code)
    ? { label: 'Origin', value: countryName(code), countryCode: code.toUpperCase() }
    : { label: 'Origin', value: code }
}

const present = (facts: (RoleFact | null)[]) => facts.filter((fact) => fact !== null)

export function roleFacts(role: FilmRole): RoleFact[][] {
  const groups = [
    present([role.gender ? { label: 'Gender', value: role.gender } : null, origin(role.origin)]),
    present([
      range('Age', role.ageMin, role.ageMax, 'years'),
      range('Height', role.heightMin, role.heightMax, 'cm'),
      range('Weight', role.weightMin, role.weightMax, 'kg'),
    ]),
  ]

  return groups.filter((group) => group.length > 0)
}