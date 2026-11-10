import * as z from 'zod'

export const createCrewSchema = z.object({
  productionName: z.string().trim().min(1, 'Name your crew').max(200, 'Use at most 200 characters'),
})

export const joinCrewSchema = z.object({
  productionCode: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9]{6}$/, 'The code has 6 letters or digits'),
})

export type CreateCrewValues = z.infer<typeof createCrewSchema>
export type JoinCrewValues = z.infer<typeof joinCrewSchema>