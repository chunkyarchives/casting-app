export const participantRoles = ['Actor', 'Director', 'CastingDirector'] as const
export type ParticipantRole = (typeof participantRoles)[number]

export type SignInRequest = {
  email: string
  password: string
}

export type SignUpRequest = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string 
  role: ParticipantRole
}