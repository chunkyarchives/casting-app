import { useState, type ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type Props = {
  src: string
  alt: string
  label: string
  caption?: { title: string; description?: string }
  disabled?: boolean
  className?: string  
  children: ReactNode
}

async function decodeImage(src: string) {
  const image = new Image()
  image.src = src
  try {
    await image.decode()
    return true
  } catch {
    return false
  }
}

export function ImageZoom({ src, alt, label, caption, disabled = false, className, children }: Props) {
  const [open, setOpen] = useState(false)

  const show = async () => {
    if (await decodeImage(src)) setOpen(true)
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={show}
        aria-label={label}
        className={cn(
          'shrink-0 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 enabled:cursor-zoom-in',
          className,
        )}
      >
        {children}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay
            forceRender
            className="bg-black/70 duration-300 supports-backdrop-filter:backdrop-blur-none"
          />
        </DialogPortal>
        <DialogContent
          className={cn(
            'w-auto bg-transparent p-0 shadow-none ring-0 sm:max-w-[90vw]',
            '[clip-path:inset(0)] transition-[clip-path] duration-300 ease-out data-open:animate-none data-closed:animate-none',
            'data-starting-style:[clip-path:inset(50%_0)] data-ending-style:[clip-path:inset(50%_0)]',
          )}
        >
          <figure className="flex cursor-zoom-out flex-col items-center gap-3" onClick={() => setOpen(false)}>
            <img
              src={src}
              alt={alt}
              className={cn('max-w-full object-contain', caption ? 'max-h-[75vh]' : 'max-h-[85vh]')}
            />
            {caption ? (
              <figcaption className="flex flex-col items-center gap-1.5 text-center">
                <DialogTitle className="text-white">{caption.title}</DialogTitle>
                {caption.description && (
                  <DialogDescription className="text-white/70">{caption.description}</DialogDescription>
                )}
              </figcaption>
            ) : (
              <DialogTitle className="sr-only">{alt}</DialogTitle>
            )}
          </figure>
        </DialogContent>
      </Dialog>
    </>
  )
}