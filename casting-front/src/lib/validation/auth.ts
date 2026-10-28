import * as z from 'zod'
import { signUpRoles } from '@/types/participant'

const nameChars = /^[\p{L}\p{M}][\p{L}\p{M}'’. -]*$/u

const specialChar = /[^a-zA-Z0-9]/

export function splitFullName(fullName: string) {
  const [firstName, ...rest] = fullName.trim().replace(/\s+/g, ' ').split(' ')
  return { firstName, lastName: rest.join(' ') }
}

export const signInSchema = z.object({
  email: z.string().trim().min(1, 'Enter your e-mail').max(254, 'E-mail is too long'),
  password: z.string().min(1, 'Enter your password').max(100, 'Password is too long'),
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
    email: z
      .string()
      .trim()
      .max(254, 'Email is too long')
      .pipe(z.email('Enter a valid email address')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be at most 100 characters')
      .regex(/[a-z]/, 'Add a lowercase letter')
      .regex(/[A-Z]/, 'Add an uppercase letter')
      .regex(/\d/, 'Add a number')
      .regex(specialChar, 'Add a special character, for example ! or #'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    role: z.enum(signUpRoles, { error: 'Choose your role' }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export type SignInValues = z.infer<typeof signInSchema>
export type SignUpValues = z.infer<typeof signUpSchema>