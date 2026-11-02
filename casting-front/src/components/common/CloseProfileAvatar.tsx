import { useState } from 'react'
import { ProfileAvatar } from '@/components/common/ProfileAvatar'
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from '@/components/ui/dialog'
import { profilePictureUrl } from '@/lib/api/participants'
import { cn } from '@/lib/utils'

type Props = {
  participantId: string
  name: string
  className?: string
}

async function decodePicture(src: string) {
  const image = new Image()
  image.src = src
  try {
    await image.decode()
  } catch {
  }
}

export function CloseProfileAvatar({ participantId, name, className }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false)
  const src = profilePictureUrl(participantId)

  const show = async () => {
    await decodePicture(src)
    setOpen(true)
  }

  return (
    <>
      <button
        type="button"
        disabled={!loaded}
        onClick={show}
        aria-label={`Show the profile picture of ${name}`}
        className="shrink-0 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50 enabled:cursor-zoom-in"
      >
        <ProfileAvatar participantId={participantId} className={className} onLoadedChange={setLoaded} />
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
          <DialogTitle className="sr-only">{name}</DialogTitle>
          <img src={src} alt={`Profile picture of ${name}`} className="max-h-[85vh] max-w-full object-contain" />
        </DialogContent>
      </Dialog>
    </>
  )
}