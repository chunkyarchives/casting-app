export const statisticsSectionTitles = {
  activity: 'Activity',
  accounts: 'Accounts',
  productions: 'Productions',
  applications: 'Applications'
} as const

export type StatisticsSectionId = keyof typeof statisticsSectionTitles

export const statisticsSectionIds = Object.keys(statisticsSectionTitles) as StatisticsSectionId[]