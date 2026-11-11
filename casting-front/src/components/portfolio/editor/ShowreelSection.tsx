import { useId, useRef, useState, type ChangeEvent } from 'react'
import { AddTile } from '@/components/common/actions/AddTile'
import { SectionTitle } from '@/components/common/display/SectionTitle'
import { ShowreelTile } from '@/components/portfolio/media/ShowreelTile'
import { maxShowreels } from '@/components/portfolio/portfolio-kinds'
import { toast } from '@/components/ui/toast'
import { portfolioApi } from '@/lib/api/portfolio'
import { acceptedVideoTypes, maxShowreelBytes } from '@/lib/media-shapes'
import type { MediaItem } from '@/types/media'
import { ShowreelDraft } from './ShowreelDraft'

type Draft = {
  file: File
  url: string
}

type Props = {
  showreels: MediaItem[]
  onAdded: (showreel: MediaItem) => void
  onChanged: (showreel: MediaItem) => void
  onRemoved: (showreelId: string) => void
}

export function ShowreelSection({ showreels, onAdded, onChanged, onRemoved }: Props) {
  const titleId = useId()
  const input = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const full = showreels.length >= maxShowreels

  const choose = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!acceptedVideoTypes.includes(file.type)) {
      toast.add({ type: 'error', title: 'Pick an MP4 or WebM video' })
      return
    }
    if (file.size > maxShowreelBytes) {
      toast.add({ type: 'error', title: 'The video is too large', description: 'A showreel can be at most 200 MB.' })
      return
    }
    setDraft({ file, url: URL.createObjectURL(file) })
  }

  const closeDraft = (current: Draft) => {
    URL.revokeObjectURL(current.url)
    setDraft(null)
  }

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-4">
      <SectionTitle id={titleId}>Showreels</SectionTitle>
      <p className="-mt-1 text-sm text-muted-foreground">
        Short videos of your work. Point at one to preview it, click it to watch it with sound.
      </p>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {showreels.map((showreel, position) => (
          <li key={showreel.id}>
            <ShowreelTile
              showreel={showreel}
              label={`showreel ${position + 1}`}
              onCaptionChange={async (next) => onChanged(await portfolioApi.updateCaption(showreel.id, next))}
              onDelete={async () => {
                await portfolioApi.remove(showreel.id)
                onRemoved(showreel.id)
              }}
            />
          </li>
        ))}
        {draft && (
          <li>
            <ShowreelDraft
              key={draft.url}
              file={draft.file}
              previewUrl={draft.url}
              onCancel={() => closeDraft(draft)}
              onUploaded={(showreel) => {
                closeDraft(draft)
                onAdded(showreel)
              }}
            />
          </li>
        )}
        {!full && !draft && (
          <li>
            <AddTile label="Add a showreel" shape="video" onClick={() => input.current?.click()} />
          </li>
        )}
      </ul>
      <span className="self-end text-xs text-muted-foreground tabular-nums">
        {showreels.length} / {maxShowreels}
      </span>
      <input ref={input} type="file" accept={acceptedVideoTypes.join(',')} hidden onChange={choose} />
    </section>
  )
}