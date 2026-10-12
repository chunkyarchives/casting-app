import * as z from 'zod'
import { participantRoles } from '@/types/participant'

// Unicode letters (č, ć, đ, ž...), spaces, apostrophes, hyphens, dots
const nameChars = /^[\p{L}\p{M}][\p{L}\p{M}'’. -]*$/u
const usernameChars = /^[a-zA-Z0-9_]+$/

// "Donny De Pippa" -> { firstName: "Donny", lastName: "De Pippa" }
export function splitFullName(fullName: string) {
  const [firstName, ...rest] = fullName.trim().replace(/\s+/g, ' ').split(' ')
  return { firstName, lastName: rest.join(' ') }
}

export const signInSchema = z.object({
  username: z.string().trim().min(1, 'Enter your username').max(30, 'Username is too long'),
  password: z.string().min(1, 'Enter your password').max(128, 'Password is too long'),
})

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Enter your full name')
      .max(100, 'Name is too long')
      .regex(nameChars, 'Name can only contain letters, spaces, apostrophes, hyphens and dots')
      .refine((v) => v.split(/\s+/).length >= 2, 'Enter both first and last name'),
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be at most 30 characters')
      .regex(usernameChars, 'Only letters, numbers and underscores'),
    email: z
      .string()
      .trim()
      .max(254, 'Email is too long')
      .pipe(z.email('Enter a valid email address')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters')
      .regex(/[a-z]/, 'Add a lowercase letter')
      .regex(/[A-Z]/, 'Add an uppercase letter')
      .regex(/\d/, 'Add a number'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    role: z.enum(participantRoles, { error: 'Choose your role' }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export type SignInValues = z.infer<typeof signInSchema>
export type SignUpValues = z.infer<typeof signUpSchema>