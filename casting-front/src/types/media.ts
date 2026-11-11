export type MediaKind =
  | 'ProfilePicture'
  | 'Headshot'
  | 'FullBody'
  | 'ProductionStill'
  | 'Showreel'
  | 'FilmPoster'
  | 'RoleConceptArt'

export type PhotoKind = Extract<MediaKind, 'Headshot' | 'FullBody' | 'ProductionStill'>

export type MediaItem = {
  id: string
  kind: MediaKind
  caption: string | null
  contentType: string
  sizeBytes: number
  createdAt: string
  url: string
}