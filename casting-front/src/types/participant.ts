export const participantRoles = ['Admin', 'Actor', 'Director', 'CastingDirector'] as const
export type ParticipantRole = (typeof participantRoles)[number]

export const signUpRoles = ['Actor', 'Director', 'CastingDirector'] as const satisfies readonly ParticipantRole[]
export type SignUpRole = (typeof signUpRoles)[number]

export type CurrentParticipant = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: ParticipantRole
  profileComplete: boolean
  profilePictureUrl: string | null
}

export type SignInRequest = {
  email: string
  password: string
}

export type SignUpRequest = {
  firstName: string
  lastName: string
  email: string
  password: string 
  role: ParticipantRole
}