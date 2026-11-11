import { useRef, useState } from 'react'
import { PlayIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { mediaUrl } from '@/lib/api/media'
import { cn } from '@/lib/utils'
import type { MediaItem } from '@/types/media'
import { CaptionEditor } from './CaptionEditor'
import { MediaActions } from './MediaActions'
import { ShowreelPlayer } from './ShowreelPlayer'

const posterFrame = '#t=0.1'

type Props = {
  showreel: MediaItem
  label: string
  onCaptionChange?: (caption: string | null) => Promise<void>
  onDelete?: () => Promise<void>
}

export function ShowreelTile({ showreel, label, onCaptionChange, onDelete }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const [previewing, setPreviewing] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [editing, setEditing] = useState(false)
  const src = mediaUrl(showreel.url)
  const title = showreel.caption ?? label

  const startPreview = () => {
    const element = video.current
    if (!element) return
    setPreviewing(true)
    void element.play().catch(() => setPreviewing(false))
  }

  const stopPreview = () => {
    const element = video.current
    setPreviewing(false)
    if (!element) return
    element.pause()
    element.currentTime = 0.1
  }

  return (
    <figure className="group/media relative aspect-video overflow-hidden rounded-2xl border bg-black shadow-sm">
      <button
        type="button"
        aria-label={`Play ${title}`}
        onClick={() => {
          stopPreview()
          setPlaying(true)
        }}
        onPointerEnter={(event) => event.pointerType === 'mouse' && startPreview()}
        onPointerLeave={stopPreview}
        onFocus={(event) => event.target.matches(':focus-visible') && startPreview()}
        onBlur={stopPreview}
        className="block size-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:ring-inset"
      >
        <video
          ref={video}
          src={`${src}${posterFrame}`}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          className="pointer-events-none size-full object-cover"
        />
        <span
          className={cn(
            'pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity duration-200',
            previewing && 'opacity-0',
          )}
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
            <HugeiconsIcon icon={PlayIcon} strokeWidth={2} className="size-5" />
          </span>
        </span>
      </button>

      {showreel.caption && !editing && (
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/85 via-black/45 to-transparent px-3 pt-8 pb-2.5 text-sm text-white">
          {showreel.caption}
        </figcaption>
      )}

      {onCaptionChange && onDelete && !editing && (
        <MediaActions itemLabel={label} onEdit={() => setEditing(true)} onDelete={onDelete} />
      )}

      {onCaptionChange && editing && (
        <CaptionEditor caption={showreel.caption} onSave={onCaptionChange} onClose={() => setEditing(false)} />
      )}

      <ShowreelPlayer src={src} title={title} open={playing} onOpenChange={setPlaying} />
    </figure>
  )
}