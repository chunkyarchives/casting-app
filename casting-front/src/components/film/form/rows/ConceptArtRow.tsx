import { useRef, useState, type ChangeEvent } from 'react'
import { Cancel01Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { BlobImage } from '@/components/common/media/BlobImage'
import { ImageCropDialog } from '@/components/common/media/ImageCropDialog'
import { MediaImage } from '@/components/common/media/MediaImage'
import { SettingsRow } from '@/components/settings/SettingsRow'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { mediaUrl } from '@/lib/api/media'
import { cropImage, type CropArea } from '@/lib/crop-image'
import { acceptedImageTypes, imageShapes } from '@/lib/media-shapes'
import { conceptArtCaptionMaxLength, maxConceptArt, type ConceptArtValue } from '@/lib/validation/film'
import type { RowField } from './row-field'

const artId = (art: ConceptArtValue) => (art.kind === 'saved' ? art.media.id : art.id)

export function ConceptArtRow({ field, error }: { field: RowField<ConceptArtValue[]>; error?: string }) {
  const input = useRef<HTMLInputElement>(null)
  const [source, setSource] = useState<string | null>(null)
  const [cropping, setCropping] = useState(false)
  const items = field.value
  const full = items.length >= maxConceptArt

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
    const picture = await cropImage(source, area, imageShapes.roleConceptArt).catch(() => null)
    setCropping(false)
    if (!picture) {
      toast.add({ type: 'error', title: 'The picture could not be cropped' })
      return
    }
    field.onChange([...items, { kind: 'new', id: crypto.randomUUID(), picture, caption: '' }])
    closeCrop()
  }

  const change = (id: string, next: ConceptArtValue | null) =>
    field.onChange(next ? items.map((art) => (artId(art) === id ? next : art)) : items.filter((art) => artId(art) !== id))

  return (
    <SettingsRow
      label="Concept art"
      hint={`Up to ${maxConceptArt} square pictures of how the character looks. The first one is the cover of the role card.`}
      error={error}
      layout='stacked'
    >
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {items.map((art, position) => (
          <ConceptArtItem
            key={artId(art)}
            art={art}
            position={position}
            onChange={(next) => change(artId(art), next)}
          />
        ))}
        {!full && (
          <li>
            <button
              type="button"
              onClick={() => input.current?.click()}
              aria-label="Add concept art"
              className="flex aspect-square w-full items-center justify-center rounded-xl border-2 border-dashed text-muted-foreground transition-colors outline-none hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} className="size-6" />
            </button>
          </li>
        )}
      </ul>
      <span className="self-end text-xs text-muted-foreground tabular-nums">
        {items.length} / {maxConceptArt}
      </span>
      <input ref={input} type="file" accept={acceptedImageTypes.join(',')} hidden onChange={choose} />

      <ImageCropDialog
        image={source}
        shape={imageShapes.roleConceptArt}
        title="Crop the concept art"
        saving={cropping}
        onCancel={closeCrop}
        onConfirm={(area) => void crop(area)}
      />
    </SettingsRow>
  )
}

type ItemProps = {
  art: ConceptArtValue
  position: number
  onChange: (next: ConceptArtValue | null) => void
}

function ConceptArtItem({ art, position, onChange }: ItemProps) {
  const label = `concept art ${position + 1}`

  return (
    <li className="flex min-w-0 flex-col gap-1.5">
      <div className="relative">
        {art.kind === 'new' ? (
          <BlobImage blob={art.picture} className="aspect-square w-full rounded-xl object-cover ring-1 ring-border" />
        ) : (
          <MediaImage src={mediaUrl(art.media.url)} alt="" className="aspect-square w-full rounded-xl ring-1 ring-border" />
        )}
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label={`Remove ${label}`}
          className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-destructive focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-3.5" />
        </button>
        {position === 0 && (
          <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[0.625rem] font-medium text-white">
            Cover
          </span>
        )}
      </div>

      {art.kind === 'new' ? (
        <Input
          value={art.caption}
          onChange={(event) => onChange({ ...art, caption: event.target.value })}
          aria-label={`Caption for ${label}`}
          placeholder="Caption"
          maxLength={conceptArtCaptionMaxLength}
          className="h-8 text-xs"
        />
      ) : (
        <span className="truncate px-1 text-xs text-muted-foreground" title={art.media.caption ?? undefined}>
          {art.media.caption ?? 'No caption'}
        </span>
      )}
    </li>
  )
}