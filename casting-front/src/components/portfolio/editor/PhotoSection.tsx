import { useId, useRef, useState, type ChangeEvent } from 'react'
import { AddTile } from '@/components/common/actions/AddTile'
import { SectionTitle } from '@/components/common/display/SectionTitle'
import { ImageCropDialog } from '@/components/common/media/ImageCropDialog'
import { captionMaxLength } from '@/components/portfolio/media/CaptionEditor'
import { PhotoTile } from '@/components/portfolio/media/PhotoTile'
import type { PhotoGroup } from '@/components/portfolio/portfolio-kinds'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { apiErrorMessage } from '@/lib/api/errors'
import { portfolioApi } from '@/lib/api/portfolio'
import { cropImage, type CropArea } from '@/lib/crop-image'
import { acceptedImageTypes, imageShapes } from '@/lib/media-shapes'
import type { MediaItem } from '@/types/media'

type Props = {
  group: PhotoGroup
  photos: MediaItem[]
  onAdded: (photo: MediaItem) => void
  onChanged: (photo: MediaItem) => void
  onRemoved: (photoId: string) => void
}

export function PhotoSection({ group, photos, onAdded, onChanged, onRemoved }: Props) {
  const titleId = useId()
  const captionId = useId()
  const input = useRef<HTMLInputElement>(null)
  const [source, setSource] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const full = photos.length >= group.max

  const close = () => {
    if (source) URL.revokeObjectURL(source)
    setSource(null)
    setCaption('')
  }

  const choose = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!acceptedImageTypes.includes(file.type)) {
      toast.add({ type: 'error', title: 'Pick a JPEG, PNG or WebP picture' })
      return
    }
    setSource(URL.createObjectURL(file))
  }

  const upload = async (area: CropArea) => {
    if (!source) return
    setUploading(true)
    const photo = await cropImage(source, area, imageShapes.actorPhoto)
      .then((picture) => portfolioApi.addPhoto(group.kind, picture, caption.trim() || null))
      .catch((error: unknown) => {
        toast.add({ type: 'error', title: 'The picture could not be uploaded', description: apiErrorMessage(error) })
        return null
      })
    setUploading(false)
    if (!photo) return

    onAdded(photo)
    close()
  }

  const label = (position: number) => `${group.title.toLowerCase()} picture ${position + 1}`

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-4">
      <SectionTitle id={titleId}>{group.title}</SectionTitle>
      <p className="-mt-1 text-sm text-muted-foreground">{group.hint}</p>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))]">
        {photos.map((photo, position) => (
          <li key={photo.id}>
            <PhotoTile
              photo={photo}
              label={label(position)}
              onCaptionChange={async (next) => onChanged(await portfolioApi.updateCaption(photo.id, next))}
              onDelete={async () => {
                await portfolioApi.remove(photo.id)
                onRemoved(photo.id)
              }}
            />
          </li>
        ))}
        {!full && (
          <li>
            <AddTile label={`Add ${group.title.toLowerCase()}`} shape="square" onClick={() => input.current?.click()} />
          </li>
        )}
      </ul>
      <span className="self-end text-xs text-muted-foreground tabular-nums">
        {photos.length} / {group.max}
      </span>
      <input ref={input} type="file" accept={acceptedImageTypes.join(',')} hidden onChange={choose} />

      <ImageCropDialog
        image={source}
        shape={imageShapes.actorPhoto}
        title={`Add to ${group.title.toLowerCase()}`}
        saving={uploading}
        confirmLabel="Upload"
        savingLabel="Uploading…"
        onCancel={close}
        onConfirm={(area) => void upload(area)}
      >
        <Field>
          <FieldLabel htmlFor={captionId}>Caption</FieldLabel>
          <Input
            id={captionId}
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            maxLength={captionMaxLength}
            placeholder="Optional, like the play or the photographer"
            disabled={uploading}
          />
        </Field>
      </ImageCropDialog>
    </section>
  )
}