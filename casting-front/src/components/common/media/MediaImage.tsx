import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Status = 'loading' | 'loaded' | 'failed'

type Props = {
  src: string
  alt: string
  className?: string
  fallback?: ReactNode
}

export function MediaImage({ src, alt, className, fallback }: Props) {
  const [result, setResult] = useState<{ src: string; status: Status } | null>(null)
  const status: Status = result?.src === src ? result.status : 'loading'
  const showIfCached = (image: HTMLImageElement | null) => {
    if (status === 'loading' && image?.complete && image.naturalWidth > 0) setResult({ src, status: 'loaded' })
  }

  return (
    <div className={cn('overflow-hidden bg-muted', status === 'loading' && 'animate-pulse', className)}>
      {status === 'failed' ? (
        fallback
      ) : (
        <img
          ref={showIfCached}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setResult({ src, status: 'loaded' })}
          onError={() => setResult({ src, status: 'failed' })}
          className={cn(
            'size-full object-cover transition-opacity duration-300',
            status === 'loading' && 'opacity-0',
          )}
        />
      )}
    </div>
  )
}