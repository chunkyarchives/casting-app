export type ImageShape = {
  width: number
  height: number
}

export const imageShapes = {
  profilePicture: { width: 1000, height: 1000 },
  filmPoster: { width: 1000, height: 1500 },
  roleConceptArt: { width: 1200, height: 1600 },
} satisfies Record<string, ImageShape>

export const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp']