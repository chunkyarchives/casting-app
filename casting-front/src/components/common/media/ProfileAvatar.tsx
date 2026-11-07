import { useState } from 'react'
import { preload } from 'react-dom'
import defaultProfilePicture from '@/assets/images/default.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { profilePictureSource } from '@/lib/api/participants'
import { cn } from '@/lib/utils'

type PictureState = 'loading' | 'loaded' | 'missing'

type Props = {
  participantId: string
  pictureUrl?: string | null
  className?: string
  onLoadedChange?: (loaded: boolean) => void
}

export function ProfileAvatar({ participantId, pictureUrl, className, onLoadedChange }: Props) {
  const src = profilePictureSource(participantId, pictureUrl)
  const [picture, setPicture] = useState<PictureState>('loading')
  const [loadingSrc, setLoadingSrc] = useState(src)
  if (src !== loadingSrc) {
    setLoadingSrc(src)
    setPicture('loading')
  }
  const shown = src ? picture : 'missing'

  preload(defaultProfilePicture, { as: 'image' })

  return (
    <Avatar className={cn(shown === 'loading' && 'animate-pulse bg-muted', className)}>
      {src && (
        <AvatarImage
          src={src}
          alt=""
          onLoadingStatusChange={(status) => {
            const next = status === 'loaded' ? 'loaded' : status === 'error' ? 'missing' : 'loading'
            setPicture(next)
            onLoadedChange?.(next === 'loaded')
          }}
          className="animate-in duration-300 fade-in-0"
        />
      )}
      {shown === 'missing' && (
        <AvatarFallback>
          <img
            src={defaultProfilePicture}
            alt=""
            className="size-full animate-in rounded-full object-cover duration-300 fade-in-0"
          />
        </AvatarFallback>
      )}
    </Avatar>
  )
}