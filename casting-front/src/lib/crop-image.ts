import type { ImageShape } from '@/lib/media-shapes'

export type CropArea = {
  x: number
  y: number
  width: number
  height: number
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('The image could not be read.'))
    image.src = src
  })

export async function cropImage(src: string, area: CropArea, shape: ImageShape): Promise<Blob> {
  const image = await loadImage(src)
  const scale = Math.min(1, shape.width / area.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(area.width * scale)
  canvas.height = Math.round(area.height * scale)

  const context = canvas.getContext('2d')
  if (!context) throw new Error('The image could not be cropped.')
  context.imageSmoothingQuality = 'high'
  context.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height)

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('The image could not be cropped.'))), 'image/jpeg', 0.92),
  )
}