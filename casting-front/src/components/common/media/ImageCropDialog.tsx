import { useState, type ReactNode } from 'react'
import Cropper from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import type { CropArea } from '@/lib/crop-image'
import type { ImageShape } from '@/lib/media-shapes'

type Props = {
  image: string | null
  shape: ImageShape
  title: string
  round?: boolean
  saving: boolean
  confirmLabel?: string
  savingLabel?: string
  children?: ReactNode
  onCancel: () => void
  onConfirm: (area: CropArea) => void
}

const maxZoom = 3

export function ImageCropDialog({
  image,
  shape,
  title,
  round = false,
  saving,
  confirmLabel = 'Save picture',
  savingLabel = 'Saving…',
  children,
  onCancel,
  onConfirm,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [area, setArea] = useState<CropArea | null>(null)
  const [shownImage, setShownImage] = useState(image)
  if (image !== shownImage) {
    setShownImage(image)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setArea(null)
  }

  return (
    <Dialog open={image !== null} onOpenChange={(open) => !open && !saving && onCancel()}>
      <DialogContent showCloseButton={false} className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Drag the picture to move it, and zoom with the slider or the mouse wheel.</DialogDescription>
        </DialogHeader>

        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black">
          {image && (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              maxZoom={maxZoom}
              aspect={shape.width / shape.height}
              cropShape={round ? 'round' : 'rect'}
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setArea(pixels)}
            />
          )}
        </div>

        <Slider
          aria-label="Zoom"
          min={1}
          max={maxZoom}
          step={0.01}
          value={[zoom]}
          onValueChange={(value) => setZoom(Array.isArray(value) ? value[0] : value)}
        />

        {children}

        <DialogFooter>
          <Button variant="outline" disabled={saving} onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={saving || area === null} onClick={() => area && onConfirm(area)}>
            {saving ? savingLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}