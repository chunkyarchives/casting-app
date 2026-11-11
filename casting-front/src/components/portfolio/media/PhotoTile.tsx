import { useState } from 'react'
import { ImageZoom } from '@/components/common/media/ImageZoom'
import { MediaImage } from '@/components/common/media/MediaImage'
import { mediaUrl } from '@/lib/api/media'
import { cn } from '@/lib/utils'
import type { MediaItem } from '@/types/media'
import { CaptionEditor } from './CaptionEditor'
import { MediaActions } from './MediaActions'

type Props = {
  photo: MediaItem
  label: string
  onCaptionChange?: (caption: string | null) => Promise<void>
  onDelete?: () => Promise<void>
}

export function PhotoTile({ photo, label, onCaptionChange, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const src = mediaUrl(photo.url)

  return (
    <figure className="group/media relative aspect-square overflow-hidden rounded-2xl border bg-muted shadow-sm">
      <ImageZoom
        src={src}
        alt={photo.caption ?? label}
        label={`Show ${label}`}
        caption={photo.caption ? { title: photo.caption } : undefined}
        className="block size-full"
      >
        <MediaImage src={src} alt={photo.caption ?? label} className="size-full" />
      </ImageZoom>

      {photo.caption && !editing && (
        <figcaption
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/85 via-black/45 to-transparent px-3 pt-8 pb-2.5 text-sm text-white',
            'opacity-0 transition-opacity duration-200 group-focus-within/media:opacity-100 group-hover/media:opacity-100 pointer-coarse:opacity-100',
          )}
        >
          {photo.caption}
        </figcaption>
      )}

      {onCaptionChange && onDelete && !editing && (
        <MediaActions itemLabel={label} onEdit={() => setEditing(true)} onDelete={onDelete} />
      )}

      {onCaptionChange && editing && (
        <CaptionEditor caption={photo.caption} onSave={onCaptionChange} onClose={() => setEditing(false)} />
      )}
    </figure>
  )
}