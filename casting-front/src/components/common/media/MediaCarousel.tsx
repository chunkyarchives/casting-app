import { ArrowLeft01Icon, ArrowRight01Icon, ImageNotFound01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { MediaImage } from '@/components/common/media/MediaImage'
import { mediaUrl } from '@/lib/api/media'
import { cn } from '@/lib/utils'
import type { MediaItem } from '@/types/media'

type Props = {
  items: MediaItem[]
  label: string
  itemLabel: (position: number) => string
  emptyIcon: IconSvgElement
  index: number
  onIndexChange: (index: number) => void
  controls: boolean
  loadAll: boolean
}

const arrowClass =
  'absolute top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-opacity duration-200 hover:bg-black/75 focus-visible:ring-[3px] focus-visible:ring-ring/60 focus-visible:outline-none'

export function MediaCarousel({ items, label, itemLabel, emptyIcon, index, onIndexChange, controls, loadAll }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center bg-muted text-muted-foreground">
        <HugeiconsIcon icon={emptyIcon} strokeWidth={1.5} className="size-1/3" />
      </div>
    )
  }

  const many = items.length > 1
  const shown = controls && many
  const go = (step: number) => onIndexChange((index + step + items.length) % items.length)

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      className="relative aspect-square overflow-hidden bg-muted"
    >
      <div
        className="flex size-full transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {items.map((item, position) => (
          <div
            key={item.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${position + 1} of ${items.length}`}
            aria-hidden={position !== index}
            className="size-full shrink-0"
          >
            {(position === index || loadAll) && (
              <MediaImage
                src={mediaUrl(item.url)}
                alt={item.caption ?? itemLabel(position)}
                className="size-full"
                fallback={<MissingPicture />}
              />
            )}
          </div>
        ))}
      </div>

      {many && (
        <>
          <button
            type="button"
            aria-label="Previous picture"
            tabIndex={shown ? 0 : -1}
            onClick={() => go(-1)}
            className={cn(arrowClass, 'left-2', !shown && 'pointer-events-none opacity-0')}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next picture"
            tabIndex={shown ? 0 : -1}
            onClick={() => go(1)}
            className={cn(arrowClass, 'right-2', !shown && 'pointer-events-none opacity-0')}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
          </button>

          <div
            className={cn(
              'absolute inset-x-0 bottom-2 flex justify-center gap-1.5 transition-opacity duration-200',
              !shown && 'pointer-events-none opacity-0',
            )}
          >
            {items.map((item, position) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Show picture ${position + 1}`}
                aria-current={position === index}
                tabIndex={shown ? 0 : -1}
                onClick={() => onIndexChange(position)}
                className={cn(
                  'h-1.5 rounded-full bg-white/50 shadow transition-[width,background-color] duration-200 hover:bg-white/80',
                  position === index ? 'w-4 bg-white' : 'w-1.5',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function MissingPicture() {
  return (
    <div className="flex size-full items-center justify-center text-muted-foreground">
      <HugeiconsIcon icon={ImageNotFound01Icon} strokeWidth={1.5} className="size-1/3" />
    </div>
  )
}