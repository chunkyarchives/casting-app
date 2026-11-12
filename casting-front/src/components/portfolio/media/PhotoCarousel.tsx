import { useState } from 'react'
import { Image01Icon } from '@hugeicons/core-free-icons'
import { MediaCarousel } from '@/components/common/media/MediaCarousel'
import type { MediaItem } from '@/types/media'

type Props = {
  items: MediaItem[]
  label: string
}

export function PhotoCarousel({ items, label }: Props) {
  const [index, setIndex] = useState(0)
  const shownIndex = Math.min(index, Math.max(items.length - 1, 0))
  const shown = items.at(shownIndex)

  return (
    <figure className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-2xl border">
        <MediaCarousel
          items={items}
          label={label}
          itemLabel={(position) => `${label} ${position + 1}`}
          emptyIcon={Image01Icon}
          index={shownIndex}
          onIndexChange={setIndex}
          controls
          loadAll
        />
      </div>
      <figcaption className="grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs text-muted-foreground">
        <span className="col-start-2 truncate text-center">{shown?.caption}</span>
        <span className="text-right tabular-nums">
          {shownIndex + 1} / {items.length}
        </span>
      </figcaption>
    </figure>
  )
}