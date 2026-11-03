export const pickKnown = <T extends string>(known: readonly T[], values: string[]) => known.filter((value) => values.includes(value))

export const onlyOneChecked = <T extends string>(checked: T[], yes: T): boolean | undefined => checked.length === 1 ? checked[0] === yes : undefined

export function parsePage(value: string | null) {
  const page = Number(value)
  return Number.isInteger(page) && page > 1 ? page : 1
}