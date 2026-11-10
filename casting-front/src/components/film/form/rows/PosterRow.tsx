import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Delete02Icon, ImageUpload01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { FilmPoster } from '@/components/common/media/FilmPoster'
import { ImageCropDialog } from '@/components/common/media/ImageCropDialog'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { cropImage, type CropArea } from '@/lib/crop-image'
import { acceptedImageTypes, imageShapes } from '@/lib/media-shapes'
import type { PosterValue } from '@/lib/validation/film'
import type { RowField } from './row-field'

export function PosterRow({ field }: { field: RowField<PosterValue> }) {
  const input = useRef<HTMLInputElement>(null)
  const [source, setSource] = useState<string | null>(null)
  const [cropping, setCropping] = useState(false)
  const poster = field.value

  useEffect(() => {
    if (poster.kind !== 'new') return
    return () => URL.revokeObjectURL(poster.preview)
  }, [poster])

  const closeCrop = () => {
    if (source) URL.revokeObjectURL(source)
    setSource(null)
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

  const crop = async (area: CropArea) => {
    if (!source) return
    setCropping(true)
    const picture = await cropImage(source, area, imageShapes.filmPoster).catch(() => null)
    setCropping(false)
    if (!picture) {
      toast.add({ type: 'error', title: 'The picture could not be cropped' })
      return
    }
    field.onChange({ kind: 'new', picture, preview: URL.createObjectURL(picture) })
    closeCrop()
  }

  return (
    <SettingsRow
      label="Poster"
      hint="Shown in your film library and on the public Movies page. It's uploaded when you press Save."
      align="start"
    >
      <div className="flex items-center gap-4">
        {poster.kind === 'new' ? (
          <img src={poster.preview} alt="" className="aspect-2/3 w-20 shrink-0 rounded-lg object-cover ring-1 ring-border" />
        ) : (
          <FilmPoster
            posterUrl={poster.kind === 'saved' ? poster.url : null}
            className="w-20 shrink-0 overflow-hidden rounded-lg ring-1 ring-border"
          />
        )}

        <div className="flex flex-1 flex-col gap-2">
          <Button type="button" variant="outline" onClick={() => input.current?.click()}>
            <HugeiconsIcon icon={ImageUpload01Icon} strokeWidth={2} data-icon="inline-start" />
            {poster.kind === 'none' ? 'Upload poster' : 'Change poster'}
          </Button>
          {poster.kind !== 'none' && (
            <Button type="button" variant="outline" onClick={() => field.onChange({ kind: 'none' })}>
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} data-icon="inline-start" />
              Remove
            </Button>
          )}
        </div>
        <input ref={input} type="file" accept={acceptedImageTypes.join(',')} hidden onChange={choose} />
      </div>

      <ImageCropDialog
        image={source}
        shape={imageShapes.filmPoster}
        title="Crop the poster"
        saving={cropping}
        onCancel={closeCrop}
        onConfirm={(area) => void crop(area)}
      />
    </SettingsRow>
  )
}