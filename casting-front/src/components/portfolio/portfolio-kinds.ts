import type { PhotoKind } from '@/types/media'

export type PhotoGroup = {
  kind: PhotoKind
  title: string
  max: number
  hint: string
}

export const photoGroups: PhotoGroup[] = [
  { kind: 'Headshot', title: 'Headshots', max: 5, hint: 'Close-ups of your face, the first thing a director looks at.' },
  { kind: 'FullBody', title: 'Full body', max: 5, hint: 'Pictures of you from head to toe.' },
  { kind: 'ProductionStill', title: 'Production stills', max: 10, hint: 'Frames from films and plays you were in.' },
]

export const maxShowreels = 3