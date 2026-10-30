import type { AccountStats, ApplicationStats, FilmStats } from '@/types/admin'

export type PieSlice = {
  key: string
  label: string
  value: number
  share: number
}

export type PieNote = {
  label: string
  value: number
  share: number
}

export type StatPie = {
  title?: string
  total: number
  slices: PieSlice[]
  notes?: PieNote[]
}

const shareOf = (part: number, whole: number) => (whole > 0 ? part / whole : 0)

type SliceInput = Omit<PieSlice, 'share'>

// A pie only makes sense when its slices don't overlap and together form the whole
function toPie(slices: SliceInput[], extra: { title?: string; notes?: PieNote[] } = {}): StatPie {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)

  return {
    ...extra,
    total,
    slices: slices.map((slice) => ({ ...slice, share: shareOf(slice.value, total) })),
  }
}

export const accountPies = (accounts: AccountStats): StatPie[] => {
  const completeProfiles = accounts.total - accounts.incompleteProfiles
  const ofTotal = (value: number) => shareOf(value, accounts.total)

  return [
    toPie(
      [
        { key: 'actors', label: 'Actors', value: accounts.actors },
        { key: 'directors', label: 'Directors', value: accounts.directors },
        { key: 'castingDirectors', label: 'Casting directors', value: accounts.castingDirectors },
        { key: 'admins', label: 'Admins', value: accounts.admins },
      ],
      {
        notes: [
            { label: 'Incomplete profiles', value: accounts.incompleteProfiles, share: ofTotal(accounts.incompleteProfiles) },
            { label: 'Complete profiles', value: completeProfiles, share: ofTotal(completeProfiles) },
            { label: 'Locked', value: accounts.locked, share: ofTotal(accounts.locked) }
        ],
      },
    ),
  ]
}

export const filmPies = (films: FilmStats): StatPie[] => [
  toPie(
    [
      { key: 'active', label: 'Active', value: films.active },
      { key: 'archived', label: 'Archived', value: films.archived },
    ],
    { title: 'Films' },
  ),
  toPie(
    [
      { key: 'openRoles', label: 'Open', value: films.openRoles },
      { key: 'filledRoles', label: 'Filled', value: films.filledRoles },
    ],
    { title: 'Roles' },
  ),
]

export const applicationPies = (applications: ApplicationStats): StatPie[] => [
  toPie([
    { key: 'proposed', label: 'Proposed', value: applications.proposed },
    { key: 'accepted', label: 'Accepted', value: applications.accepted },
    { key: 'rejected', label: 'Rejected', value: applications.rejected },
  ]),
]