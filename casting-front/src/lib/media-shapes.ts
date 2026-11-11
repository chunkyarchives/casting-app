export type ImageShape = {
  width: number
  height: number
}

export const imageShapes = {
  profilePicture: { width: 1000, height: 1000 },
  filmPoster: { width: 1000, height: 1500 },
  roleConceptArt: { width: 1200, height: 1200 },
  actorPhoto: { width: 1200, height: 1200 },
} satisfies Record<string, ImageShape>

export const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp']

export const acceptedVideoTypes = ['video/mp4', 'video/webm']

export const maxShowreelBytes = 200 * 1024 * 1024