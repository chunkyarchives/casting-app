import { Film01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { MediaImage } from '@/components/common/media/MediaImage'
import { mediaUrl } from '@/lib/api/media'
import { cn } from '@/lib/utils'

type Props = {
  posterUrl: string | null
  className?: string
}

export function FilmPoster({ posterUrl, className }: Props) {
  const frame = cn('aspect-2/3', className)

  if (posterUrl === null) {
    return (
      <div className={cn('bg-muted', frame)}>
        <PosterPlaceholder />
      </div>
    )
  }

  return <MediaImage src={mediaUrl(posterUrl)} alt="" className={frame} fallback={<PosterPlaceholder />} />
}

function PosterPlaceholder() {
  return (
    <div className="flex size-full items-center justify-center text-muted-foreground">
      <HugeiconsIcon icon={Film01Icon} strokeWidth={1.5} className="size-1/3" />
    </div>
  )
}