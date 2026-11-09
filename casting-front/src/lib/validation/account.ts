import { addDays, format } from 'date-fns'
import * as z from 'zod'

export const maxDeactivationDays = 365

const isoDay = (date: Date) => format(date, 'yyyy-MM-dd')

export const deactivationRange = () => {
  const today = new Date()
  return { first: isoDay(addDays(today, 1)), last: isoDay(addDays(today, maxDeactivationDays)) }
}

const passwordField = z.string().min(1, 'Enter your password').max(100, 'Your password is too long')

export const deactivateSchema = z.object({
  until: z
    .string()
    .min(1, 'Pick a day')
    .refine((day) => {
      const { first, last } = deactivationRange()
      return day >= first && day <= last
    }, 'Pick a day between tomorrow and one year from now'),
  password: passwordField,
})

export const deleteAccountSchema = z.object({
  password: passwordField,
})

export type VisibilityValues = {
  isProfilePublic: boolean
}

export type DeactivateValues = z.infer<typeof deactivateSchema>
export type DeleteAccountValues = z.infer<typeof deleteAccountSchema>